const { Router } = require("express");
const router = Router();
const userRoutes = require("./user.routes")
const jobRoutes = require("./job-post.routes")
const adminRoutes = require("./admin.routes")

router.use("/user", userRoutes);
router.use("/job", jobRoutes);
router.use("/admin", adminRoutes);
module.exports = router;

