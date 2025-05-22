const express = require("express");
const { verifyEmployerToken, verifyEmployeeToken } = require("../middleware/verifyJWT");
const { createJobPost, getAllMyJobPosts, getAllJobPosts, getJobPostById, updateJobPost, deleteJobPost } = require("../controllers/JobPost.controller");
const { applyForJob, getApplicationsForJob, getMyApplications, updateApplicationStatus } = require("../controllers/apply.controller");

const router = express.Router();

router.post("/create", verifyEmployerToken, createJobPost);
router.get("/get-my", verifyEmployerToken, getAllMyJobPosts);
router.get("/get-all", getAllJobPosts);
router.get("/:id", getJobPostById);
router.put("/:id", verifyEmployerToken, updateJobPost);
router.delete("/:id", verifyEmployerToken, deleteJobPost);
router.post("/apply", verifyEmployeeToken, applyForJob);
router.get("/application/mine", verifyEmployeeToken, getMyApplications);
router.get("/application/:id", verifyEmployerToken, getApplicationsForJob);
router.patch("/application/:id/status", verifyEmployerToken, updateApplicationStatus);

module.exports = router;
