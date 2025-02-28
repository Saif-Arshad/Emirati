const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.applyForJob = async (req, res) => {
    const { jobId, cover_letter, experience, contactInfo } = req.body;
    try {
        const isAlreadyApplied = await prisma.apply.findFirst({
            where: {
                jobId: parseInt(jobId),
                applicantId: req.user.id,
            },
        });
        if (isAlreadyApplied) {
            return res.status(401).json({ error: "You already applied for this Job." });
        }

        const application = await prisma.apply.create({
            data: {
                jobId: parseInt(jobId),
                applicantId: req.user.id,
                cover_letter,
                contactInfo,
                experience,
            },
        });
        return res.status(201).json(application);
    } catch (error) {
        console.log("🚀 ~ exports.applyForJob= ~ error:", error);
        return res.status(500).json({ error: "Failed to apply for job." });
    }
};

exports.getMyApplications = async (req, res) => {
    const employeeId = req.user.id;
    console.log("🚀 ~ exports.getMyApplications= ~ employeeId:", employeeId);
    try {
        const applications = await prisma.apply.findMany({
            where: {
                applicantId: employeeId,
            },
            include: {
                JobPost: true,
            },
        });
        return res.status(200).json(applications);
    } catch (error) {
        console.log("🚀 ~ exports.getMyApplications= ~ error:", error);
        return res.status(500).json({ error: "Failed to get my applications." });
    }
};
exports.getApplicationsForJob = async (req, res) => {
    const { id } = req.params;
    console.log("🚀 ~ req.params:", req.params);
    try {
        const applications = await prisma.apply.findMany({
            where: { jobId: parseInt(id) },
            include: {
                User: {
                    include: {
                        Employee: true,
                    },
                },
            },
        });
        return res.status(200).json(applications);
    } catch (error) {
        console.log("🚀 ~ exports.getApplicationsForJob= ~ error:", error);
        return res.status(500).json({ error: "Failed to fetch applications." });
    }
};
