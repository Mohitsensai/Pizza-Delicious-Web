import nodemailer from "nodemailer";

export const sendLowStockAlert = async (lowItems) => {
    try {
        if (!lowItems.length) return;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.ALERT_EMAIL,
                pass: process.env.ALERT_EMAIL_PASS
            }
        });

        const message = `
            <h3>⚠️ Low Stock Alert</h3>
            <p>The following ingredients are below the threshold (20):</p>
            <ul>
                ${lowItems.map(item => `<li>${item}</li>`).join("")}
            </ul>
        `;

        await transporter.sendMail({
            from: `"Pizza Inventory" <${process.env.ALERT_EMAIL}>`,
            to: process.env.ALERT_RECIPIENT,
            subject: "Low Inventory Alert",
            html: message
        });

        console.log("Low stock alert email sent.");
    } catch (error) {
        console.error("Failed to send low stock alert:", error);
    }
};
