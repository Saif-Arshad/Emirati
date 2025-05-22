const express = require("express");
const { register, login, getEmployeeDashboard, getEmployerDashboard, verifyResetLinkAPI, resendVerificationEmail, getGovtDashboard, getAdminDashboard, updateTargetEmirati } = require("../controllers/user.controller");
const { verifyEmployeeToken, verifyEmployerToken, verifyGovtToken, verifyAdminToken } = require("../middleware/verifyJWT");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-reset-link", verifyResetLinkAPI);
router.post("/resend-verification", resendVerificationEmail);
router.get("/employee/dashboard", verifyEmployeeToken, getEmployeeDashboard);
router.get("/employer/dashboard", verifyEmployerToken, getEmployerDashboard);
router.get("/govt/dashboard", verifyGovtToken, getGovtDashboard);
router.get("/admin/dashboard", verifyAdminToken, getAdminDashboard);
router.patch("/employer/:employerId/target-emirati", verifyAdminToken, updateTargetEmirati);

module.exports = router;
