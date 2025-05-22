/* eslint-disable react/prop-types */
import {
    Dialog,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { useState } from 'react';
import { toast } from 'react-toastify';

const JobPostDetailDialog = ({ open, onClose, job }) => {
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const token = localStorage.getItem("user-token");
    
    if (!job) return null;

    const handleStatusUpdate = async (applicationId, newStatus) => {
        setUpdatingStatus(true);
        try {
            const userToken = token.replace(/"/g, "");
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/job/application/${applicationId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userToken}`,
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update status.");
            }

            toast.success("Application status updated successfully!");
            // You might want to refresh the job data here
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.message || "Failed to update application status!");
        } finally {
            setUpdatingStatus(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <h1 className="font-bold p-5 text-2xl">{job.title}</h1>
            <div className="p-4 border-t border-gray-200">
                <div className="mb-4 flex items-start gap-3">
                    <h3 className="text-lg font-semibold">Description:</h3>
                    <p className="text-sm text-gray-700">{job.description}</p>
                </div>
                <div className="mb-4 flex items-center gap-3">
                    <h3 className="text-lg font-semibold">Company:</h3>
                    <p className="text-sm text-gray-700">{job.companyName}</p>
                </div>
                <div className="mb-4 flex items-center gap-3">
                    <h3 className="text-lg font-semibold">Location:</h3>
                    <p className="text-sm text-gray-700">{job.location}</p>
                </div>
                <div className="mb-4 flex items-center gap-3">
                    <h3 className="text-lg font-semibold">Job Type:</h3>
                    <p className="text-sm text-gray-700">{job.jobType}</p>
                </div>
                {job.salary && (
                    <div className="mb-4 flex items-center gap-3">
                        <h3 className="text-lg font-semibold">Salary:</h3>
                        <p className="text-sm text-gray-700">{job.salary}</p>
                    </div>
                )}
                <div className="mb-4 flex items-center gap-3">
                    <h3 className="text-lg font-semibold">Status:</h3>
                    <p className="text-sm text-gray-700">{job.status}</p>
                </div>
                <div className="mb-4 flex items-center gap-3">
                    <h3 className="text-lg font-semibold">Posted At:</h3>
                    <p className="text-sm text-gray-700">
                        {new Date(job.postedAt).toLocaleString()}
                    </p>
                </div>

                {/* Applications Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Applications ({job.applications?.length || 0})</h2>
                    <div className="space-y-4">
                        {job.applications?.map((application) => (
                            <div key={application.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            {application.User?.fullName || "Applicant"}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Applied on: {new Date(application.appliedAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            <strong>Experience:</strong> {application.experience}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Contact:</strong> {application.contactInfo}
                                        </p>
                                        {application.cover_letter && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                <strong>Cover Letter:</strong><br />
                                                {application.cover_letter}
                                            </p>
                                        )}
                                    </div>
                                    <div className="min-w-[150px]">
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                value={application.status || "UNDER_REVIEW"}
                                                label="Status"
                                                onChange={(e) => handleStatusUpdate(application.id, e.target.value)}
                                                disabled={updatingStatus}
                                            >
                                                <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
                                                <MenuItem value="HIRED">Hired</MenuItem>
                                                <MenuItem value="CLOSED">Closed</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <DialogActions>
                <button
                    onClick={onClose}
                    className="text-white mx-5 cursor-pointer border-blue-500 border-2 bg-blue-500 hover:bg-blue-700 hover:border-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none"
                >
                    Close
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default JobPostDetailDialog;
