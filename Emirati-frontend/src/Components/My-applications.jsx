import { useEffect, useState } from "react";
import Layout from "./shared/SidebarLayout";
import { toast } from "react-toastify";
import { Modal, Box, Typography, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

function MyApplications() {
    const token = localStorage.getItem("user-token");
    const [loading, setLoading] = useState(false);
    const [myApplications, setMyApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);


    useEffect(() => {
        const fetchMyApplications = async () => {
            setLoading(true);
            try {
                if (!token) {
                    console.error("🚀 ~ fetchMyApplications ~ No token found");
                    setLoading(false);
                    return;
                }

                const userToken = token.replace(/"/g, "");
                console.log("🚀 ~ fetchMyApplications ~ userToken:", userToken);

                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/job/application/mine`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch applications.");
                }

                const data = await response.json();
                setMyApplications(data);
            } catch (error) {
                console.error("🚀 ~ fetchMyApplications ~ error:", error);
                toast.error(error.message || "Something went wrong while fetching applications!");
            } finally {
                setLoading(false);
            }
        };

        fetchMyApplications();
    }, [token]);

   
    // Open modal and set the selected job application
    const handleOpenModal = (application) => {
        setSelectedApplication(application);
        setOpenModal(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedApplication(null);
    };

    return (
        <Layout>
            <div className="min-h-screen w-full  flex flex-col items-center py-10">
                <h1 className="text-3xl font-bold text-black text-start w-full mb-6">My Applications</h1>

                {loading ? (
                    <div className="flex justify-center items-center mt-10">
                        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    </div>
                ) : myApplications.length === 0 ? (
                    <div className="text-gray-500 text-lg text-center mt-6">
                        You haven&apos;t applied for any jobs yet.
                    </div>
                ) : (
                    <div className="w-full  max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
                        {myApplications.map((application) => (
                            <div key={application.id} className="bg-slate-100 shadow-md w-full rounded-lg p-5 border border-gray-200">
                                <h2 className="text-xl text-start font-semibold text-gray-800">
                                    {application.JobPost.title}
                                </h2>
                                <p className="text-gray-600 text-start">
                                    {application.JobPost.companyName}
                                </p>
                                <p className="text-gray-600 text-start">
                                    <strong>Location:</strong> {application.JobPost.location}
                                </p>
                                <p className="text-gray-600 text-start">
                                    <strong>Job Type:</strong> {application.JobPost.jobType.replace("_", " ")}
                                </p>
                                <p className="text-gray-600 text-start">
                                    <strong>Salary:</strong> {application.JobPost.salary}
                                </p>
                                <p className="text-gray-600 text-start">
                                    <strong>Status:</strong>{" "}
                                    <span className={`font-semibold ${
                                        application.status === "HIRED" ? "text-green-600" :
                                        application.status === "CLOSED" ? "text-red-600" :
                                        "text-blue-600"
                                    }`}>
                                        {application.status?.replace("_", " ")}
                                    </span>
                                </p>
                                <p className="text-gray-500 text-start text-sm mt-1">
                                    You Applied on: {new Date(application.appliedAt).toLocaleDateString()}
                                </p>
                                <div className="pt-4 flex items-center justify-between">
                                    {/* <FormControl size="small" className="w-[150px]">
                                        <InputLabel>Update Status</InputLabel>
                                        <Select
                                            value={application.status || ""}
                                            label="Update Status"
                                            onChange={(e) => handleStatusUpdate(application.id, e.target.value)}
                                            disabled={updatingStatus}
                                        >
                                            {statusOptions.map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    {status.replace("_", " ")}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl> */}
                                    <button
                                        onClick={() => handleOpenModal(application)}
                                        className="rounded-full cursor-pointer border-2 border-blue-500 bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-700 hover:border-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Modal open={openModal} onClose={handleCloseModal}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 500,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                        }}
                    >
                        {selectedApplication && (
                            <>
                                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                                    {selectedApplication.JobPost.title}
                                </Typography>
                                <Typography>
                                    <strong>Company:</strong> {selectedApplication.JobPost.companyName}
                                </Typography>
                                <Typography>
                                    <strong>Location:</strong> {selectedApplication.JobPost.location}
                                </Typography>
                                <Typography>
                                    <strong>Job Type:</strong> {selectedApplication.JobPost.jobType.replace("_", " ")}
                                </Typography>
                                <Typography>
                                    <strong>Salary:</strong> ${selectedApplication.JobPost.salary}
                                </Typography>
                                <Typography>
                                    <strong>Applied On:</strong>{" "}
                                    {new Date(selectedApplication.appliedAt).toLocaleDateString()}
                                </Typography>
                                <Typography sx={{ mt: 2 }}>
                                    <strong>Cover Letter:</strong> {selectedApplication.cover_letter}
                                </Typography>
                                <Typography>
                                    <strong>Experience:</strong> {selectedApplication.experience}
                                </Typography>
                                <Typography>
                                    <strong>Contact Info:</strong> {selectedApplication.contactInfo}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 3 }}
                                    onClick={handleCloseModal}
                                >
                                    Close
                                </Button>
                            </>
                        )}
                    </Box>
                </Modal>
            </div>
        </Layout>
    );
}

export default MyApplications;
