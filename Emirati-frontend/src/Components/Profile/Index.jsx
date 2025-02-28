import { useState, useEffect } from 'react';
import Layout from '../shared/SidebarLayout';

function DashboardPage() {
    const role = localStorage.getItem("user-role");
    const token = localStorage.getItem("user-token");


    const userToken = token.replace(/"/g, '');
    const userRole = role.replace(/"/g, '');

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (userRole == "GOVT") {
                    return
                }
                const endpoint =
                    userRole === "EMPLOYEE"
                        ? "/api/user/employee"
                        :
                        userRole === "EMPLOYER" ?

                            "/api/user/employer" :
                            userRole === "ADMIN" ?
                                "/api/user/admin"

                                :


                                "";

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
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center mt-4">{error}</div>;
    }

    const cards =
        userRole === "EMPLOYEE"
            ? [
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
            ]
            :
            userRole === "EMPLOYER" ?

                [
                    {
                        title: "Your Total Job vacancie",
                        value: dashboardData.totalJobPosts,
                    },
                    {
                        title: "Total Applications Received",
                        value: dashboardData.totalApplications,
                    },
                    {
                        title: "Active Job vacancie",
                        value: dashboardData.activeJobPosts,
                    },
                ] :
                userRole === "ADMIN" ?

                    [
                        {
                            title: "Total Job vacancie",
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
                            title: "New Job vacancie",
                            value: dashboardData.newJobPosts,
                        },
                    ]
                    :
                    [
                        {
                            title: "Total Employee",
                            value: 0,
                        },
                        {
                            title: "Total Employers",
                            value: 0,
                        },
                        {
                            title: "Active Job vacancie",
                            value: 0,
                        },
                    ]
        ;

    return (
        <Layout>

            <div className="container mx-auto p-4 min-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="bg-slate-100 rounded-xl p-6 "
                        >
                            <h3 className="text-xl font-semibold text-gray-700">{card.title}</h3>
                            <p className="text-4xl font-bold text-gray-900 mt-4">
                                {card.value}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </Layout>

    );
}

export default DashboardPage; 
