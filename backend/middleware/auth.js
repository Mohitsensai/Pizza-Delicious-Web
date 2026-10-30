import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    let token = req.headers.token;
    if (!token && req.headers.authorization) {
        if (req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        } else {
            token = req.headers.authorization;
        }
    }

    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login Again" });
    }

    try {
        const secret = process.env.JWT_SECRET || "random#Secret";
        const token_decode = jwt.verify(token, secret);
        req.userId = token_decode.id;
        if (!req.body) {
            req.body = {};
        }
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.error("Auth verification failed:", error.message);
        res.json({ success: false, message: "Session expired or invalid. Please login again." });
    }
};

export default authMiddleware;
