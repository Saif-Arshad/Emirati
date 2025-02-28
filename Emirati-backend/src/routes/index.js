const { Router } = require("express");
const router = Router();
const userRoutes = require("./user.routes")
const jobRoutes = require("./job-post.routes")
const adminRoutes = require("./admin.routes")
const govtRoutes = require("./govt.routes")

router.use("/user", userRoutes);
router.use("/job", jobRoutes);
router.use("/admin", adminRoutes);
router.use("/govt", govtRoutes);
module.exports = router;

