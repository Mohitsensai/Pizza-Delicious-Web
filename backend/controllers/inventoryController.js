import inventoryModel from "../models/inventoryModel.js";
import nodemailer from "nodemailer"; // For email alerts

// Utility: send email alert
const sendLowStockAlert = async (lowItems) => {
    if (!process.env.ALERT_EMAIL || !process.env.ALERT_EMAIL_PASS) {
        console.warn("ALERT_EMAIL or ALERT_EMAIL_PASS not configured. Skipping email alert.");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ALERT_EMAIL,
            pass: process.env.ALERT_EMAIL_PASS,
        }
    });

    const mailOptions = {
        from: process.env.ALERT_EMAIL,
        to: process.env.ALERT_RECIPIENT || process.env.ALERT_EMAIL,
        subject: "Inventory Low Alert",
        text: `The following ingredients are low on stock:\n${lowItems.join("\n")}`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error("Failed to send email:", err);
    }
};

// GET Inventory
export const getInventory = async (req, res) => {
    try {
        let inventory = await inventoryModel.findOne();
        if (!inventory) {
            inventory = await inventoryModel.create({});
        }
        res.json({ success: true, data: inventory });
    } catch (error) {
        console.error("Get inventory error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch inventory" });
    }
};

// POST Update Inventory + alert if low
export const updateInventory = async (req, res) => {
    try {
        const updated = await inventoryModel.findOneAndUpdate({}, req.body, { new: true, upsert: true });

        if (!updated) {
            return res.status(500).json({ success: false, message: "Failed to update inventory" });
        }

        // Check thresholds
        const lowItems = [];
        const threshold = 20;

        if (updated.base < threshold) lowItems.push(`Base: ${updated.base}`);
        if (updated.sauce < threshold) lowItems.push(`Sauce: ${updated.sauce}`);
        if (updated.cheese < threshold) lowItems.push(`Cheese: ${updated.cheese}`);

        if (updated.veggies) {
            for (let key in updated.veggies) {
                if (typeof updated.veggies[key] === 'number' && updated.veggies[key] < threshold) {
                    lowItems.push(`${key} (veggie): ${updated.veggies[key]}`);
                }
            }
        }

        if (updated.meat) {
            for (let key in updated.meat) {
                if (typeof updated.meat[key] === 'number' && updated.meat[key] < threshold) {
                    lowItems.push(`${key} (meat): ${updated.meat[key]}`);
                }
            }
        }

        // 🔔 Send email if any low
        if (lowItems.length > 0) await sendLowStockAlert(lowItems);

        res.json({ success: true, data: updated });
    } catch (error) {
        console.error("Update inventory error:", error);
        res.status(500).json({ success: false, message: "Failed to update inventory" });
    }
};
