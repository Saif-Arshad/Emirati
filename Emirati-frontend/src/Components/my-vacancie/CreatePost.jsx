/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box,
} from '@mui/material';
import { toast } from 'react-toastify';

const JobPostDialog = ({ setIsCreate }) => {
    const [title, setTitle] = useState('');
    const [open, setOpen] = useState(false)
    const token = localStorage.getItem("user-token");

    const [loading, setLoading] = useState(false)
    const [description, setDescription] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [location, setLocation] = useState('');
    const [jobType, setJobType] = useState('');
    const [salary, setSalary] = useState('');
    const onClose = () => {
        setOpen(false)
    }
    const handleSubmit = async () => {
        if (!title || !description || !location || !companyName || !jobType) {
            toast.error('All Fields are required');
            return;
        }

        setLoading(true);
        const formData = {
            title,
            description,
            companyName,
            location,
            jobType,
            salary: salary.trim() === '' ? null : salary,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/job/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token.replace(/"/g, '')}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to create job post');
            }

            const data = await response.json();
            console.log('Job created successfully:', data);
            toast.success('Job posted successfully!');

            setTitle('');
            setDescription('');
            setCompanyName('');
            setLocation('');
            setJobType('');
            setSalary('');
            setIsCreate(true)
            onClose();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to create job post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="text-white cursor-pointer border-blue-500 border-2 bg-blue-500 hover:bg-blue-700 hover:border-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0  focus:outline-none "
            >
                Create New vacancy
            </button>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <h2 className='text-2xl font-bold p-7 pb-4'>Create New vacancy</h2>
                <DialogContent>
                    <Box component="form" noValidate sx={{ mt: 2 }}>
                        <div className="mb-2">
                            <input
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full ring-1 ring-blue-100 p-3 text-sm text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                                id="title"
                                type="text"
                                value={title}
                                placeholder="Job Title"
                            />
                        </div>
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full my-2 ring-1 ring-blue-100 p-3 text-sm text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                            id="title"
                            type="text"
                            value={description}
                            rows={5}
                            placeholder='Discription '
                        />

                        <div className="mb-2">
                            <input
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full ring-1 ring-blue-100 p-3 text-sm text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                                id="company"
                                type="text"
                                placeholder="Company Name"
                            />
                        </div>
                        <div className='grid grid-cols-1 py-3 md:grid-cols-2 gap-4'>
                            <input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full ring-1 ring-blue-100 p-3 text-sm text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                                id="location"
                                type="text"
                                placeholder="Job Location"
                            />
                            <input
                                value={salary}

                                onChange={(e) => setSalary(e.target.value)}
                                className="w-full ring-1 ring-blue-100 p-3 text-sm text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                                id="salary"
                                type="number"
                                placeholder="Salary"
                            />

                        </div>



                        {/* Job Type Select */}
                        <FormControl fullWidth margin="dense" variant="outlined">
                            <InputLabel id="job-type-label">Job Type</InputLabel>
                            <Select
                                sx={{
                                    borderRadius: "10px",
                                }}
                                labelId="job-type-label"
                                label="Job Type"
                                value={jobType}
                                onChange={(e) => setJobType(e.target.value)}
                            >
                                <MenuItem value="FULL_TIME">Full Time</MenuItem>
                                <MenuItem value="PART_TIME">Part Time</MenuItem>
                                <MenuItem value="CONTRACT">Contract</MenuItem>
                                <MenuItem value="INTERN">Intern</MenuItem>
                                <MenuItem value="FREELANCE">Freelance</MenuItem>
                            </Select>
                        </FormControl>


                    </Box>
                </DialogContent>
                <DialogActions>

                    <button
                        onClick={handleSubmit}
                        className="text-white cursor-pointer border-blue-500 border-2 bg-blue-500 hover:bg-blue-700 hover:border-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0  focus:outline-none "
                    >
                        {
                            loading ? "Loading..." : "Create"
                        }

                    </button>
                </DialogActions>
            </Dialog>
        </>

    );
};

export default JobPostDialog;
