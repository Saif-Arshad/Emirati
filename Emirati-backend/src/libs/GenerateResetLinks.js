
const crypto = require("crypto")
exports.generateResetLink = (user) => {
    const timestamp = Date.now();

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("RESET_PASSWORD_SECRET is not defined");
    }

    const data = `${user.id}:${timestamp}`;

    const signature = crypto
        .createHmac("sha256", secret)
        .update(data)
        .digest("hex");

    const resetLink = `${process.env.FRONTEND_URL}/verify?user=${encodeURIComponent(
        user.id
    )}&ts=${timestamp}&sig=${signature}`;

    return resetLink;
};


exports.verifyResetLink = (userId, ts, sig) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("RESET_PASSWORD_SECRET is not defined");
    }
    const data = `${userId}:${ts}`;
    const expectedSig = crypto
        .createHmac("sha256", secret)
        .update(data)
        .digest("hex");

    if (sig !== expectedSig) {
        return false;
    }

    const timestamp = parseInt(ts, 10);
    if (Date.now() - timestamp > 10 * 60 * 1000) {
        return false;
    }

    return true;
}
