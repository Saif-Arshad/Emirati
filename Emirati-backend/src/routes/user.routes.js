const express = require("express");
const { register, login, getEmployeeDashboard, getEmployerDashboard, resendVerificationEmail, verifyResetLinkAPI, getAdminDashboard, getGovtDashboard } = require("../controllers/user.controller");
const { verifyEmployeeToken, verifyEmployerToken, verifyAdminToken } = require("../middleware/verifyJWT");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-verify-mail", resendVerificationEmail);
router.post("/verify-user", verifyResetLinkAPI);
router.get("/employee", verifyEmployeeToken, getEmployeeDashboard);
router.get("/employer", verifyEmployerToken, getEmployerDashboard);
router.get("/admin", getAdminDashboard);
router.get("/govt", getGovtDashboard);

module.exports = router;
