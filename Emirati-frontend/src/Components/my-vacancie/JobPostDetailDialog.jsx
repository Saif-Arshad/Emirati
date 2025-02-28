/* eslint-disable react/prop-types */
import {
    Dialog,
    DialogActions,
} from '@mui/material';

const JobPostDetailDialog = ({ open, onClose, job }) => {
    if (!job) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
                <div className="mb-4 flex items-center gap-3">

                    <h3 className="text-lg font-semibold">Applications:</h3>
                    <p className="text-sm text-gray-700">
                        {job.applications && job.applications.length} Application(s)
                    </p>
                </div>
            </div>

            <DialogActions>
                <button
                    onClick={onClose}

                    className="text-white mx-5 cursor-pointer border-blue-500 border-2 bg-blue-500 hover:bg-blue-700 hover:border-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0  focus:outline-none "
                >
                    Close
                </button>

            </DialogActions>
        </Dialog>
    );
};

export default JobPostDetailDialog;
