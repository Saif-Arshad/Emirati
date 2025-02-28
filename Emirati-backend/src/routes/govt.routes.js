const express = require("express");
const router = express.Router();
const {
    getAllEmployeesWithEmiratiID,
    getEmployeeAppliedDetails,
    getAllEmployersWithEmiratiID,
    getEmployerJobPosts,
} = require("../controllers/govt.controller");

router.get("/employees", getAllEmployeesWithEmiratiID);

router.get("/employees/:id/applications", getEmployeeAppliedDetails);

router.get("/employers", getAllEmployersWithEmiratiID);

router.get("/employers/:id/job-posts", getEmployerJobPosts);

module.exports = router;
