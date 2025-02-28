const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");

router.get("/users", adminController.getAllUsers);
router.post("/users", adminController.createUser);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);
router.get("/jobposts", adminController.getAllJobPosts);
router.put("/jobposts/:id", adminController.updateJobPost);
router.delete("/jobposts/:id", adminController.deleteJobPost);
router.post("/create", adminController.createAdmin);
router.post("/login", adminController.adminLogin);

module.exports = router;
