const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createJobPost = async (req, res) => {
    const { title, description, companyName, location, jobType, salary } = req.body;
    const employer = req.user.id
    try {
        const jobPost = await prisma.jobPost.create({
            data: {
                title,
                description,
                companyName,
                location,
                jobType,
                salary,
                createdBy: employer,
            },
        });
        res.status(201).json(jobPost);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to create job post." });
    }
};
exports.getAllMyJobPosts = async (req, res) => {
    try {
        const jobPosts = await prisma.jobPost.findMany({
            where: {
                createdBy: req.user.id,
            },
            include: {
                applications: {
                    include: {
                        User: {
                            select: {
                                fullName: true,
                                email: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                postedAt: "desc",
            },
        });

        return res.status(200).json(jobPosts);
    } catch (error) {
        console.log("🚀 ~ exports.getAllMyJobPosts= ~ error:", error);
        return res.status(500).json({ error: "Failed to fetch job posts." });
    }
};
exports.getAllJobPosts = async (req, res) => {

    try {
        const jobPosts = await prisma.jobPost.findMany({
            include: { User: true, applications: true },
        });
        res.status(200).json(jobPosts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch job posts." });
    }
};

exports.getJobPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const jobPost = await prisma.jobPost.findUnique({
            where: { id: parseInt(id) },
            include: {
                applications: {
                    include: {
                        User: {
                            select: {
                                fullName: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        });

        if (!jobPost) {
            return res.status(404).json({ error: "Job post not found." });
        }

        return res.status(200).json(jobPost);
    } catch (error) {
        console.log("🚀 ~ exports.getJobPostById= ~ error:", error);
        return res.status(500).json({ error: "Failed to fetch job post." });
    }
};
exports.updateJobPost = async (req, res) => {
    const { id } = req.params;
    const { title, description, location, jobType, salary, status } = req.body;

    try {
        const jobPost = await prisma.jobPost.update({
            where: { id: parseInt(id) },
            data: { title, description, location, jobType, salary, status },
        });
        res.status(200).json(jobPost);
    } catch (error) {
        res.status(500).json({ error: "Failed to update job post." });
    }
};

exports.deleteJobPost = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.jobPost.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: "Job post deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete job post." });
    }
};



