import { useEffect, useState } from "react";
import Layout from "./shared/SidebarLayout";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal, Box, Typography, Button, CircularProgress } from "@mui/material";

function JobApplicant() {
    const { id: jobId } = useParams();
    const [loading, setLoading] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const token = localStorage.getItem("user-token");

    useEffect(() => {
        const fetchJobApplicant = async () => {
            setLoading(true);
            try {
                if (!token) {
                    toast.error("User token not found!");
                    setLoading(false);
                    return;
                }

                const userToken = token.replace(/"/g, "");
                const response = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/job/application/${jobId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch job applicants.");
                }

                const data = await response.json();
                console.log("🚀 ~ fetchJobApplicant ~ data:", data);
                setApplicants(data);
            } catch (error) {
                toast.error(error.message || "Something went wrong while fetching job applicants!");
            } finally {
                setLoading(false);
            }
        };

        fetchJobApplicant();
    }, [token, jobId]);

    // Open Modal with selected applicant data
    const handleOpenModal = (applicant) => {
        setSelectedApplicant(applicant);
        setOpenModal(true);
    };

    // Close Modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedApplicant(null);
    };

    return (
        <Layout>
            <div className="min-h-screen  flex flex-col items-center py-10 sm:px-5">
                <h1 className="text-3xl text-start font-bold text-black w-full mb-6">Job Applicants</h1>

                {loading ? (
                    <div className="flex justify-center items-center mt-10">
                        <CircularProgress size={50} />
                    </div>
                ) : applicants.length === 0 ? (
                    <div className="text-gray-500 text-lg text-center mt-6">
                        No applicants for this job yet.
                    </div>
                ) : (
                    <div className="w-full  mt-5 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                        {applicants.map((applicant) => (
                            <div
                                key={applicant.id}
                                className="bg-slate-100 shadow-md rounded-lg p-5 border border-gray-200"
                            >
                                <h2 className="text-xl md:text-2xl text-start font-semibold text-gray-800">
                                    {applicant.User.fullName}
                                </h2>
                                <p className="text-gray-600 text-start text-lg" >
                                    <strong>Email:</strong> {applicant.User.email}
                                </p>
                                <p className="text-gray-600 text-start text-lg" >

                                    <strong>Relevent Experience:</strong> {applicant.experience}
                                </p>
                                <p className="text-gray-600 text-start text-lg" >

                                    Applied on: {new Date(applicant.appliedAt).toLocaleDateString()}
                                </p>
                                <div className="mt-4 flex items-center justify-end">
                                    <button
                                        onClick={() => handleOpenModal(applicant)}
                                        className="text-white cursor-pointer border-blue-500 border-2 bg-blue-500 hover:bg-blue-700 hover:border-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0  focus:outline-none "

                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* MUI Modal for Applicant Details */}
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
                        {selectedApplicant && (
                            <>
                                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                                    {selectedApplicant.User.fullName}
                                </Typography>
                                <Typography>
                                    <strong>Email:</strong> {selectedApplicant.User.email}
                                </Typography>
                                <Typography>
                                    <strong>No of Year Experience:</strong> {selectedApplicant.User.Employee[0].experience} Year
                                </Typography>
                                {/** Parse and display skills */}
                                {(() => {
                                    let skillsArr = [];
                                    try {
                                        skillsArr = JSON.parse(selectedApplicant.User.Employee[0].skills);
                                    } catch (err) {
                                        console.error("Error parsing skills", err);
                                    }
                                    return (
                                        <Typography>
                                            <strong>Skills:</strong> {skillsArr.join(", ")}
                                        </Typography>
                                    );
                                })()}
                                {(() => {
                                    let educationArr = [];
                                    try {
                                        educationArr = JSON.parse(selectedApplicant.User.Employee[0].educationList);
                                    } catch (err) {
                                        console.error("Error parsing education list", err);
                                    }
                                    return (
                                        <Typography>
                                            <strong>Education:</strong> {educationArr.join(", ")}
                                        </Typography>
                                    );
                                })()}
                                {/** Optionally show educationHistory if available */}
                                {selectedApplicant.User.Employee[0].educationHistory && (
                                    <Typography>
                                        <strong>Education History:</strong> {selectedApplicant.User.Employee[0].educationHistory}
                                    </Typography>
                                )}
                                <Typography>
                                    <strong>Cover Letter:</strong> {selectedApplicant.cover_letter}
                                </Typography>
                                <Typography>
                                    <strong>Contact Info:</strong> {selectedApplicant.contactInfo}
                                </Typography>
                                <Typography>
                                    <strong>Applied On:</strong> {new Date(selectedApplicant.appliedAt).toLocaleDateString()}
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

export default JobApplicant;
