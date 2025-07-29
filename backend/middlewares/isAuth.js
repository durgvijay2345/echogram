import jwt from "jsonwebtoken";
import User from "../models/user.model.js";  

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Token not found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "Invalid user" });
        }

        
        if (user.tokenVersion !== decoded.tokenVersion) {
            return res.status(401).json({ message: "Session expired. Please login again." });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(500).json({ message: `isAuth error: ${error.message}` });
    }
};

export default isAuth;

