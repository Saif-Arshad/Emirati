import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import Layout from '../shared/SidebarLayout';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function DashboardPage() {
    // Get user role and token from localStorage
    const role = localStorage.getItem("user-role");
    const token = localStorage.getItem("user-token");
    const userToken = token ? token.replace(/"/g, '') : "";
    const userRole = role ? role.replace(/"/g, '') : "";

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const endpoint =
                    userRole === "EMPLOYEE"
                        ? "/api/user/employee/dashboard"
                        : userRole === "EMPLOYER"
                            ? "/api/user/employer/dashboard"
                            : userRole === "GOVT"
                                ? "/api/user/govt/dashboard"
                                : "/api/user/admin/dashboard";

                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`
                    }
                });

                if (!res.ok) {
                    throw new Error("Error fetching dashboard data");
                }
                const data = await res.json();
                setDashboardData(data);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [userRole, userToken]);

    if (loading) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
                <CircularProgress />
            </Grid>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center" variant="h6">
                {error}
            </Typography>
        );
    }

    // If user role is GOVT, render charts comparing Emirati vs Non‑Emirati data
    if (userRole === "GOVT") {
        // Expected dashboardData shape for GOVT:
        // {
        //   vacancy: { emirati, nonEmirati, newEmirati, newNonEmirati },
        //   employer: { emirati, nonEmirati },
        //   employee: { emirati, nonEmirati }
        // }

        // Vacancy chart data
        const vacancyChartData = {
            labels: ['Emirati', 'Non‑Emirati'],
            datasets: [
                {
                    label: 'Vacancies',
                    data: [dashboardData.vacancy.emirati, dashboardData.vacancy.nonEmirati],
                    backgroundColor: ['#42a5f5', '#66bb6a'],
                }
            ]
        };

        // Employer chart data
        const employerChartData = {
            labels: ['Emirati', 'Non‑Emirati'],
            datasets: [
                {
                    label: 'Employers',
                    data: [dashboardData.employer.emirati, dashboardData.employer.nonEmirati],
                    backgroundColor: ['#ef5350', '#ab47bc'],
                }
            ]
        };

        // Employee chart data
        const employeeChartData = {
            labels: ['Emirati', 'Non‑Emirati'],
            datasets: [
                {
                    label: 'Employees',
                    data: [dashboardData.employee.emirati, dashboardData.employee.nonEmirati],
                    backgroundColor: ['#ffa726', '#26c6da'],
                }
            ]
        };

        return (
            <Layout>
                <Grid container spacing={3} style={{ padding: 16 }}>
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Government Dashboard
                        </Typography>
                    </Grid>

                    {/* Vacancy Chart Card */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    Vacancies
                                </Typography>
                                <Pie data={vacancyChartData} />
                                <Typography variant="body1" align="center" style={{ marginTop: 8 }}>
                                    New Vacancies (Emirati): {dashboardData.vacancy.newEmirati}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Employer Chart Card */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    Employers
                                </Typography>
                                <Pie data={employerChartData} />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Employee Chart Card */}
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    Employees
                                </Typography>
                                <Pie data={employeeChartData} />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Layout>
        );
    } else {
        // For non-GOVT roles, fallback to a simple card layout
        let cards = [];
        if (userRole === "EMPLOYEE") {
            cards = [
                {
                    title: "Total Open Job Posts",
                    value: dashboardData.totalJobPosts,
                },
                {
                    title: "Total Applications Submitted",
                    value: dashboardData.totalApplications,
                },
                {
                    title: "New Job Posts (Last 7 Days)",
                    value: dashboardData.newJobPosts,
                },
            ];
        } else if (userRole === "EMPLOYER") {
            cards = [
                {
                    title: "Your Total Job Vacancies",
                    value: dashboardData.totalJobPosts,
                },
                {
                    title: "Total Applications Received",
                    value: dashboardData.totalApplications,
                },
                {
                    title: "Active Job Vacancies",
                    value: dashboardData.activeJobPosts,
                },
                {
                    title: "Total Emirati Hired",
                    value: dashboardData.totalEmiratiHired,
                },
                {
                    title: "Our Emirati Target Percentage",
                    value: dashboardData.ourEmiratiTargetPercentage + "%",
                },
                {
                    title: "Our Emirati Hired Percentage",
                    value: dashboardData.ourEmiratiHiredPercentage + "%",
                },
            ];
        } else if (userRole === "ADMIN") {
            cards = [
                {
                    title: "Total Job Vacancies",
                    value: dashboardData.totalJobPosts,
                },
                {
                    title: "Total Employees",
                    value: dashboardData.totalEmployee,
                },
                {
                    title: "Total Employers",
                    value: dashboardData.totalEmployer,
                },
                {
                    title: "New Job Vacancies",
                    value: dashboardData.newJobPosts,
                },
            ];
        }

        return (
            <Layout>
                <Grid container spacing={3} style={{ padding: 16 }}>
                    {cards.map((card, index) => (
                        <Grid item xs={12} md={3} key={index}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" align="center">
                                        {card.title}
                                    </Typography>
                                    <Typography variant="h4" align="center">
                                        {card.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Layout>
        );
    }
}

export default DashboardPage;
