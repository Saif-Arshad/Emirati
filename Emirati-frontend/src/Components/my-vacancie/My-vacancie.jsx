import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import JobPostDialog from "./CreatePost"; // Assuming you use this dialog for creating posts
import JobPostDetailDialog from "./JobPostDetailDialog";
import { CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import Layout from '../shared/SidebarLayout';

function MyVacancies() {
    const navigate = useNavigate();
    const userRole = localStorage.getItem("user-role");
    const token = localStorage.getItem("user-token");

    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [jobPosts, setJobPosts] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isCreate, setIsCreate] = useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    useEffect(() => {
        if (!userRole || !token) {
            navigate("/");
        }
    }, [userRole, token, navigate]);

    useEffect(() => {
        const fetchJobPosts = async () => {
            setLoading(true);
            try {
                const userToken = token.replace(/"/g, "");
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/job/get-my`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch job posts.");
                }

                const data = await response.json();
                setJobPosts(data);
            } catch (error) {
                toast.error(error.message || "Something went wrong while fetching job posts!");
            } finally {
                setLoading(false);
            }
        };

        fetchJobPosts();
    }, [token, isCreate]);

    const handleDetailOpen = (job) => {
        setSelectedJob(job);
        setDetailDialogOpen(true);
    };
    const handleDetailClose = () => {
        setDetailDialogOpen(false);
        setSelectedJob(null);
    };
    const handleDelete = async (id) => {
        console.log("🚀 ~ handleDelete ~ id:", id);
        setDeleting(true)
        if (!window.confirm("Are you sure you want to delete this job post?")) return;

        try {
            const userToken = token.replace(/"/g, "");
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/job/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete job post.");
            }

            // Remove the deleted job from state
            setJobPosts((prevJobs) => prevJobs.filter((job) => job.id !== id));

            toast.success("Job post deleted successfully!");
        } catch (error) {
            console.error("🚀 ~ handleDelete ~ error:", error);
            toast.error(error.message || "Something went wrong!");
        } finally {
            setDeleting(false)
        }
    };


    return (
        <>
            <Layout>

                <div className="flex py-10 mx-auto justify-start sm:px-10 items-center gap-4">
                    <JobPostDialog setIsCreate={setIsCreate} />
                </div>
                <div className="sm:px-10">
                    {loading ? (
                        <div className="flex justify-center">
                            <CircularProgress />
                        </div>
                    ) : jobPosts.length === 0 ? (
                        <p>No job posts found.</p>
                    ) : (
                        <div className="grid 2xl:grid-cols-2 grid-cols-1 gap-5">
                            {jobPosts.map((job) => (
                                <div
                                    key={job.id}
                                    className="border bg-neutral-50 p-4  rounded-lg shadow-md flex flex-col md:flex-row items-start justify-between"
                                >
                                    <div className="flex flex-col items-start">
                                        <h3 className="text-xl capitalize font-bold">{job.title}</h3>
                                        <h4 className="text-sm  ml-1 mb-1">
                                            {job.companyName}
                                        </h4>
                                        <h4 className="text-sm  ml-1 mb-6">
                                            Total Applicants applied   {job.applications.length}
                                        </h4>
                                        <p className="text-sm text-start capitalize text-gray-600">
                                            {job.description.length > 100
                                                ? `${job.description.slice(0, 100)}...`
                                                : job.description}
                                        </p>
                                    </div>
                                    <div className="pt-6 md:mt-0 flex flex-wrap items-center gap-4">
                                        {job.applications.length > 0 &&
                                            <Link to={`/profile/my-vacancie/${job.id}`}>
                                        <button

className="text-white cursor-pointer border-green-500 border-2 bg-green-500 hover:bg-green-700 hover:border-green-700 focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0  focus:outline-none "
>
                                           Applicant Detail

                                        </button>
                                            </Link>
                                        }
                                        <button
                                            onClick={() => handleDelete(job.id)}

                                            className="text-white cursor-pointer border-red-500 border-2 bg-red-500 hover:bg-red-700 hover:border-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0  focus:outline-none "
                                        >
                                            {

                                                deleting ? "Processing.." : "  Delete Job"
                                            }

                                        </button>
                                        <button
                                            onClick={() => handleDetailOpen(job)}

                                            className="text-white cursor-pointer border-blue-500 border-2 bg-blue-500 hover:bg-blue-700 hover:border-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0  focus:outline-none "
                                        >
                                            See Detail
                                        </button>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <JobPostDetailDialog
                    open={detailDialogOpen}
                    onClose={handleDetailClose}
                    job={selectedJob}
                />
            </Layout>

        </>
    );
}

export default MyVacancies;
