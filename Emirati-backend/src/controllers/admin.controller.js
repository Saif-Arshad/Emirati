const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;


exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                Employee: true,
                Employer: true,
                JobPost: true,
                Apply: true,
            },
        });
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: "Failed to fetch users" });
    }
};

exports.createUser = async (req, res) => {
    const {
        fullName,
        email,
        password,
        role,
        skills,
        emiratiID,
        educationList,
        experience,
        companyName,
        staff,
        emiratiStaff,
        location,
    } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { fullName, email, password: hashedPassword, role, isVerified: true, emiratiID },
        });

        if (role === "EMPLOYEE") {
            await prisma.employee.create({
                data: {
                    skills: JSON.stringify(skills || []),
                    educationList: JSON.stringify(educationList || []),
                    experience: experience || "",
                    educationHistory: "",
                    user: { connect: { id: newUser.id } },
                },
            });
        } else if (role === "EMPLOYER") {
            await prisma.employer.create({
                data: {
                    companyName: companyName || "",
                    Location: location || "",
                    staff,
                    emiratiStaff,
                    currentEmiratiPercentage: staff && emiratiStaff && staff > 0
                        ? String(Math.round((emiratiStaff / staff) * 100))
                        : "0",
                    user: { connect: { id: newUser.id } },
                },
            });
        }

        return res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Failed to create user" });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { fullName, email, role } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { fullName, email, role },
        });
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Failed to update user" });
    }
};
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id);

    try {
        await prisma.$transaction([
            prisma.apply.deleteMany({ where: { applicantId: userId } }),
            prisma.jobPost.deleteMany({ where: { createdBy: userId } }),
            prisma.employee.deleteMany({ where: { userId: userId } }),
            prisma.employer.deleteMany({ where: { userId: userId } }),
            prisma.user.delete({ where: { id: userId } }),
        ]);

        return res.status(200).json({ message: "User and related data deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: "Failed to delete user" });
    }
};


exports.getAllJobPosts = async (req, res) => {
    try {
        const jobPosts = await prisma.jobPost.findMany({
            include: {
                User: true,
                applications: true,
            },
        });
        return res.status(200).json(jobPosts);
    } catch (error) {
        console.error("Error fetching job posts:", error);
        return res.status(500).json({ error: "Failed to fetch job posts" });
    }
};

exports.createJobPost = async (req, res) => {
    const { title, description, companyName, location, jobType, salary } = req.body;

    try {
        const newJobPost = await prisma.jobPost.create({
            data: {
                title,
                description,
                companyName,
                location,
                jobType,
                salary,
                createdBy: req.user.id,
            },
        });
        return res.status(201).json(newJobPost);
    } catch (error) {
        console.error("Error creating job post:", error);
        return res.status(500).json({ error: "Failed to create job post" });
    }
};

exports.updateJobPost = async (req, res) => {
    const { id } = req.params;
    const { title, description, companyName, location, jobType, salary, status } = req.body;
    try {
        const updatedJobPost = await prisma.jobPost.update({
            where: { id: parseInt(id) },
            data: { title, description, companyName, location, jobType, salary, status },
        });
        return res.status(200).json(updatedJobPost);
    } catch (error) {
        console.error("Error updating job post:", error);
        return res.status(500).json({ error: "Failed to update job post" });
    }
};

exports.deleteJobPost = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.jobPost.delete({
            where: { id: parseInt(id) },
        });
        return res.status(200).json({ message: "Job post deleted successfully" });
    } catch (error) {
        console.error("Error deleting job post:", error);
        return res.status(500).json({ error: "Failed to delete job post" });
    }
};

exports.createAdmin = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const existingAdmin = await prisma.user.findUnique({ where: { email } });
        if (existingAdmin) {
            return res.status(400).json({ error: "Admin with this email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await prisma.user.create({
            data: {
                fullName,
                email,
                isVerified: true,
                password: hashedPassword,
                role: "ADMIN",
            },
        });
        return res.status(201).json(admin);
    } catch (error) {
        console.error("Error creating admin:", error);
        return res.status(500).json({ error: "Failed to create admin" });
    }
};

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await prisma.user.findUnique({ where: { email } });
        if (!admin || admin.role !== "ADMIN") {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign({ id: admin.id, role: admin.role }, SECRET_KEY, { expiresIn: "7d" });
        return res.status(200).json({
            message: "Admin logged in successfully",
            admin: { id: admin.id, fullName: admin.fullName, email: admin.email, role: admin.role },
            token,
        });
    } catch (error) {
        console.error("Error in admin login:", error);
        return res.status(500).json({ error: "Failed to login admin" });
    }
};
