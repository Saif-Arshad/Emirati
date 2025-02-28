const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllEmployeesWithEmiratiID = async (req, res) => {
    try {
        const employees = await prisma.user.findMany({
            where: {
                role: "EMPLOYEE",
                emiratiID: { not: null },
            },
            include: {
                _count: {
                    select: { Apply: true },
                },
                Employee: true,
            },
        });
        return res.status(200).json(employees);
    } catch (error) {
        console.error("Error fetching employees with Emirati ID:", error);
        return res.status(500).json({ error: "Failed to fetch employees" });
    }
};


exports.getEmployeeAppliedDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                Apply: {
                    include: {
                        JobPost: true,
                    },
                },
            },
        });
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        if (!employee.emiratiID) {
            return res
                .status(400)
                .json({ error: "Employee does not have an Emirati ID" });
        }
        return res.status(200).json(employee);
    } catch (error) {
        console.error("Error fetching employee applied details:", error);
        return res.status(500).json({ error: "Failed to fetch employee details" });
    }
};


exports.getAllEmployersWithEmiratiID = async (req, res) => {
    try {
        const employers = await prisma.user.findMany({
            where: {
                role: "EMPLOYER",
                emiratiID: { not: null },
            },
            include: {
                _count: {
                    select: { JobPost: true },
                },
                Employer: true,
            },
        });
        return res.status(200).json(employers);
    } catch (error) {
        console.error("Error fetching employers with Emirati ID:", error);
        return res.status(500).json({ error: "Failed to fetch employers" });
    }
};

exports.getEmployerJobPosts = async (req, res) => {
    try {
        const { id } = req.params;
        const employer = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: { JobPost: true },
        });
        if (!employer) {
            return res.status(404).json({ error: "Employer not found" });
        }
        if (!employer.emiratiID) {
            return res
                .status(400)
                .json({ error: "Employer does not have an Emirati ID" });
        }
        return res.status(200).json(employer);
    } catch (error) {
        console.error("Error fetching employer job posts:", error);
        return res.status(500).json({ error: "Failed to fetch employer details" });
    }
};
