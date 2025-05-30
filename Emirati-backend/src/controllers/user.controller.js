const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { generateResetLink, verifyResetLink } = require("../libs/GenerateResetLinks");
const nodemailer = require("nodemailer")
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    try {
        const { fullName, email, password, role, emiratiID } = req.body;
        console.log("Registering user:", { fullName, email, role });

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user record
        const newUser = await prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
                role,
                emiratiID
            },
        });

        if (role === "EMPLOYEE") {
            const { skills, education, experience } = req.body;

            if (!skills || !education || !experience) {
                return res.status(400).json({ message: "Missing employee fields" });
            }

            await prisma.employee.create({
                data: {
                    skills: JSON.stringify(skills),
                    educationList: JSON.stringify(education),
                    educationHistory: "",
                    experience,
                    user: { connect: { id: newUser.id } },
                },
            });
        } else if (role === "EMPLOYER") {
            const { companyName, location, emiratiStaff, staff, targetEmirati } = req.body;

            // Validate the additional fields
            if (!companyName || !location || !staff || !emiratiStaff || !targetEmirati) {
                return res.status(400).json({ message: "Missing employer fields" });
            }

            await prisma.employer.create({
                data: {
                    companyName,
                    Location: location,
                    emiratiStaff,
                    staff,
                    targetEmirati,
                    currentEmiratiPercentage: staff && emiratiStaff && staff > 0
                        ? String(Math.round((emiratiStaff / staff) * 100))
                        : "0",
                    user: { connect: { id: newUser.id } },
                },
            });
        }

        const resetLink = generateResetLink(newUser);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Emirati Connect" <emirati@connect.com>`,
            to: email,
            subject: "Account Verification Request",
            html: `
        <h3>Account Verification</h3>
        <p>Thank you for registering with Emirati Connect!</p>
        <p>Please click the link below to verify your account:</p>
        <p><a href="${resetLink}">Verify Account</a></p>
        <p>If you did not create an account with us, please ignore this email.</p>
      `,
        };

        try {
            await transporter.sendMail(mailOptions);
            const token = jwt.sign({ id: newUser.id, role: newUser.role }, SECRET_KEY, {
                expiresIn: "7d",
            });
            res.status(201).json({
                message: "User registered successfully",
                user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email, role: newUser.role },
                token,
            });
        } catch (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ error: "Failed to send email." });
        }
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
exports.resendVerificationEmail = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetLink = generateResetLink(user);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Emirati Connect" <emirati@connect.com>`,
            to: user.email,
            subject: "Account Verification Request",
            html: `
                <h3>Account Verification</h3>
                <p>Thank you for using Emirati Connect!</p>
                <p>Please click the link below to verify your account:</p>
                <p><a href="${resetLink}">Verify Account</a></p>
                <p>If you did not request this verification, please ignore this email.</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            message: "Verification email resent successfully"
        });

    } catch (error) {
        console.error("Resend Verification Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🚀 ~ exports.login= ~ email:", email)
        console.log("🚀 ~ exports.login= ~ password:", password)

        const user = await prisma.user.findUnique({ where: { email } });
        console.log("🚀 ~ exports.login= ~ user:", user)
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        console.log("🚀 ~ exports.login= ~ user:", user)

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        if (!user.isVerified) {
            return res.status(401).json({ message: "Verify Your Email" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
            expiresIn: "7d",
        });

        res.status(200).json({
            message: "Login successful",
            user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
            token,
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


exports.getEmployeeDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalJobPosts = await prisma.jobPost.count({
            where: { status: 'OPEN' },
        });

        const totalApplications = await prisma.apply.count({
            where: { applicantId: userId },
        });

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const newJobPosts = await prisma.jobPost.count({
            where: {
                status: 'OPEN',
                postedAt: { gte: oneWeekAgo },
            },
        });

        return res.json({
            totalJobPosts,
            totalApplications,
            newJobPosts,
        });
    } catch (error) {
        console.error('Error fetching employee dashboard data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getAdminDashboard = async (req, res) => {
    try {

        const totalJobPosts = await prisma.jobPost.count({
            where: { status: 'OPEN' },
        });
        const totalEmployee = await prisma.user.count({
            where: { role: "EMPLOYEE" },
        });
        const totalEmployer = await prisma.user.count({
            where: { role: "EMPLOYER" },
        });


        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const newJobPosts = await prisma.jobPost.count({
            where: {
                status: 'OPEN',
                postedAt: { gte: oneWeekAgo },
            },
        });

        return res.json({
            totalJobPosts,
            totalEmployer,
            totalEmployee,
            newJobPosts,
        });
    } catch (error) {
        console.error('Error fetching employee dashboard data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getGovtDashboard = async (req, res) => {
    try {
        // Vacancy (job posts) counts
        const totalJobPostsEmirati = await prisma.jobPost.count({
            where: {
                status: "OPEN",
                User: {
                    emiratiID: { not: null },
                },
            },
        });
        const totalJobPostsNonEmirati = await prisma.jobPost.count({
            where: {
                status: "OPEN",
                User: {
                    emiratiID: null,
                },
            },
        });

        // Employer counts
        const totalEmployerEmirati = await prisma.user.count({
            where: {
                role: "EMPLOYER",
                emiratiID: { not: null },
            },
        });
        const totalEmployerNonEmirati = await prisma.user.count({
            where: {
                role: "EMPLOYER",
                emiratiID: null,
            },
        });

        // Employee counts
        const totalEmployeeEmirati = await prisma.user.count({
            where: {
                role: "EMPLOYEE",
                emiratiID: { not: null },
            },
        });
        const totalEmployeeNonEmirati = await prisma.user.count({
            where: {
                role: "EMPLOYEE",
                emiratiID: null,
            },
        });

        // New job posts counts in the last week for vacancies
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const newJobPostsEmirati = await prisma.jobPost.count({
            where: {
                status: "OPEN",
                postedAt: { gte: oneWeekAgo },
                User: {
                    emiratiID: { not: null },
                },
            },
        });
        const newJobPostsNonEmirati = await prisma.jobPost.count({
            where: {
                status: "OPEN",
                postedAt: { gte: oneWeekAgo },
                User: {
                    emiratiID: null,
                },
            },
        });

        return res.status(200).json({
            vacancy: {
                emirati: totalJobPostsEmirati,
                nonEmirati: totalJobPostsNonEmirati,
                newEmirati: newJobPostsEmirati,
                newNonEmirati: newJobPostsNonEmirati,
            },
            employer: {
                emirati: totalEmployerEmirati,
                nonEmirati: totalEmployerNonEmirati,
            },
            employee: {
                emirati: totalEmployeeEmirati,
                nonEmirati: totalEmployeeNonEmirati,
            },
        });
    } catch (error) {
        console.error("Error fetching Emirati government dashboard data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.verifyResetLinkAPI = async (req, res) => {
    const { user, ts, sig } = req.body;

    const userId = parseInt(user)
    if (!userId || !ts || !sig) {
        return res.status(400).json({ error: "Missing parameters." });
    }

    const isValid = verifyResetLink(userId, ts, sig);
    if (!isValid) {
        return res.status(400).json({ error: "Invalid or expired reset link." });
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { isVerified: true }
        });

        return res.status(200).json({ message: "Account verified successfully.", success: true });
    } catch (error) {
        console.error("Verification Error:", error);
        return res.status(500).json({ error: "Failed to verify account." });
    }
};

exports.getEmployerDashboard = async (req, res) => {
    try {
        const employerId = req.user.id; // Ensure `req.user` is defined

        console.log("🚀 ~ exports.getEmployerDashboard= ~ employerId:", employerId)
        // Get total job posts by employer
        const totalJobPosts = await prisma.jobPost.count({
            where: { createdBy: employerId },
        });

        // Get total applications for all employer job posts
        const totalApplications = await prisma.apply.count({
            where: {
                jobId: {
                    in: (await prisma.jobPost.findMany({
                        where: { createdBy: employerId },
                        select: { id: true },
                    })).map(job => job.id),
                },
            },
        });
        const totalEmiratiHired = await prisma.apply.count({
            where: {
                AND: [
                    {
                        jobId: {
                            in: (await prisma.jobPost.findMany({
                                where: { createdBy: employerId },
                                select: { id: true },
                            })).map(job => job.id),
                        }
                    },
                    {
                        status: "HIRED"
                    },
                    {
                        User: {
                            emiratiID: {
                                not: null
                            }
                        }
                    }
                ]
            },
        });
        const ourEmiratiTarget = await prisma.employer.findFirst({
            where: { userId: employerId },
            select: { targetEmirati: true }
        });
        const ourEmiratiTargetPercentage = ourEmiratiTarget ? parseInt(ourEmiratiTarget.targetEmirati) : 0;
        // Get active job posts
        const ourEmiratiHiredPercentage = (totalEmiratiHired / totalApplications) * 100;
        const activeJobPosts = await prisma.jobPost.count({
            where: {
                createdBy: employerId,
                status: "OPEN",
            },
        });

        return res.json({
            totalJobPosts,
            totalApplications,
            activeJobPosts,
            totalEmiratiHired,
            ourEmiratiTargetPercentage,
            ourEmiratiHiredPercentage

        });
    } catch (error) {
        console.error("❌ Error fetching employer dashboard data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.updateTargetEmirati = async (req, res) => {
    try {
        const { employerId } = req.params;
        const { targetEmirati } = req.body;

        // Validate input
        if (!targetEmirati || isNaN(targetEmirati) || targetEmirati < 0 || targetEmirati > 100) {
            return res.status(400).json({ message: "Invalid target percentage. Must be between 0 and 100." });
        }

        // Update the employer's target
        const updatedEmployer = await prisma.employer.update({
            where: { userId: parseInt(employerId) },
            data: {
                targetEmirati: String(targetEmirati)
            },
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true
                    }
                }
            }
        });

        return res.status(200).json({
            message: "Target Emirati percentage updated successfully",
            employer: updatedEmployer
        });
    } catch (error) {
        console.error("Error updating target Emirati percentage:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};


