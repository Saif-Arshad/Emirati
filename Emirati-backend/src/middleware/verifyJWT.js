
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;

const handleTokenError = (error, res) => {
    if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token has expired." });
    }
    return res.status(500).json({ error: error.message });
};


exports.verifyEmployeeToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        console.log("🚀 ~ exports.verifyEmployeeToken= ~ token:", token)
        if (!token) return res.status(403).json({ error: "Access Denied. No token provided." });

        if (token.startsWith("Bearer ")) token = token.slice(7, token.length).trimLeft();

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("🚀 ~ exports.verifyEmployeeToken= ~ decoded:", decoded)

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(401).json({ error: "Invalid or expired session." });

        if (user.role !== "EMPLOYEE") return res.status(403).json({ error: "Access Denied. Employee only route." });

        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        handleTokenError(error, res);
    }
};
exports.verifyEmployerToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        console.log("🚀 ~ exports.verifyEmployerToken= ~ token:", token)
        if (!token) return res.status(403).json({ error: "Access Denied. No token provided." });

        if (token.startsWith("Bearer ")) token = token.slice(7, token.length).trimLeft();

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("🚀 ~ exports.verifyEmployerToken= ~ decoded:", decoded)

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(401).json({ error: "Invalid or expired session." });

        if (user.role !== "EMPLOYER") return res.status(403).json({ error: "Access Denied. Employer only route." });

        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        handleTokenError(error, res);
    }
};
exports.verifyGovtToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        console.log("🚀 ~ exports.verifyEmployerToken= ~ token:", token)
        if (!token) return res.status(403).json({ error: "Access Denied. No token provided." });

        if (token.startsWith("Bearer ")) token = token.slice(7, token.length).trimLeft();

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("🚀 ~ exports.verifyEmployerToken= ~ decoded:", decoded)

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(401).json({ error: "Invalid or expired session." });

        if (user.role !== "GOVT") return res.status(403).json({ error: "Access Denied. Government only route." });

        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        handleTokenError(error, res);
    }
};

exports.verifyAdminToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        if (!token) return res.status(403).json({ error: "Access Denied. No token provided." });

        if (token.startsWith("Bearer ")) token = token.slice(7, token.length).trimLeft();

        const decoded = jwt.verify(token, SECRET_KEY);

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(401).json({ error: "Invalid or expired session." });

        if (user.role !== "ADMIN") return res.status(403).json({ error: "Access Denied. Admin only route." });

        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        handleTokenError(error, res);
    }
};
