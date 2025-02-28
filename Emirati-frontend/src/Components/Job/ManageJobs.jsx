import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    MenuItem
} from '@mui/material';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Layout from '../shared/SidebarLayout';

function ManageJobPosts() {
    // State for job posts and filters
    const [jobPosts, setJobPosts] = useState([]);
    const [filteredJobPosts, setFilteredJobPosts] = useState([]);
    const [searchText, setSearchText] = useState('');

    const token = localStorage.getItem("user-token");

    const jobTypes = [
        { value: 'FULL_TIME', label: 'Full Time' },
        { value: 'PART_TIME', label: 'Part Time' },
        { value: 'CONTRACT', label: 'Contract' },
        { value: 'INTERN', label: 'Intern' },
        { value: 'FREELANCE', label: 'Freelance' },
    ];

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Modal (Create/Edit) states
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedJobPost, setSelectedJobPost] = useState(null);

    // Form data for job posts
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        companyName: '',
        location: '',
        jobType: '',
        salary: '',
        createdBy: ''
    });

    // Fetch all job posts on component mount
    useEffect(() => {
        fetchJobPosts();
    }, []);

    // Update filtered job posts when search changes
    useEffect(() => {
        let filtered = jobPosts;
        if (searchText) {
            filtered = filtered.filter(
                (job) =>
                    job.title.toLowerCase().includes(searchText.toLowerCase()) ||
                    job.companyName.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        setFilteredJobPosts(filtered);
        setPage(0);
    }, [searchText, jobPosts]);

    // API call to fetch job posts
    const fetchJobPosts = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/jobposts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setJobPosts(data);
        } catch (error) {
            console.error('Error fetching job posts:', error);
        }
    };

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Open Create/Edit modal
    const handleOpenModal = (job = null, edit = false) => {
        setSelectedJobPost(job);
        setIsEdit(edit);
        if (job && edit) {
            // Edit mode: populate the form with existing job post data
            setFormData({
                title: job.title,
                description: job.description,
                companyName: job.companyName,
                location: job.location,
                jobType: job.jobType,
                salary: job.salary,
                createdBy: job.createdBy || ''
            });
        } else {
            // Create mode: clear the form
            setFormData({
                title: '',
                description: '',
                companyName: '',
                location: '',
                jobType: '',
                salary: '',
                createdBy: ''
            });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedJobPost(null);
        setIsEdit(false);
        setFormData({
            title: '',
            description: '',
            companyName: '',
            location: '',
            jobType: '',
            salary: '',
            createdBy: ''
        });
    };

    // Form change handler
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Submit (Create or Update)
    const handleSubmit = async () => {
        // Basic form validation
        if (
            !formData.title ||
            !formData.description ||
            !formData.companyName ||
            !formData.location ||
            !formData.jobType ||
            !formData.salary
        ) {
            toast.error('Please fill all required fields.');
            return;
        }
        if (isEdit && selectedJobPost) {
            // Update job post
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/admin/jobposts/${selectedJobPost.id}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(formData),
                    }
                );
                if (res.ok) {
                    fetchJobPosts();
                    handleCloseModal();
                    toast.success('Job post updated successfully.');
                } else {
                    console.error('Failed to update job post');
                }
            } catch (error) {
                console.error('Error updating job post:', error);
            }
        } else {
            // Create new job post
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/jobposts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData),
                });
                if (res.ok) {
                    fetchJobPosts();
                    handleCloseModal();
                    toast.success('Job post created successfully.');
                } else {
                    console.error('Failed to create job post');
                }
            } catch (error) {
                console.error('Error creating job post:', error);
            }
        }
    };

    // Delete job post
    const handleDeleteJobPost = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job post?')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/jobposts/${jobId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    fetchJobPosts();
                    toast.success('Job post deleted successfully.');
                } else {
                    console.error('Failed to delete job post');
                }
            } catch (error) {
                console.error('Error deleting job post:', error);
            }
        }
    };

    return (
        <Layout>
            <div className="p-6">
                <div className="mb-8">
                    <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-lg shadow-sm">
                        <input
                            type="text"
                            placeholder="Search job posts..."
                            className="p-2 border rounded"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />

                    </div>
                </div>

                {/* Job Posts Table */}
                <Paper className="rounded-lg shadow-md overflow-hidden">
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow className="bg-gray-50">
                                    <TableCell className="font-semibold">ID</TableCell>
                                    <TableCell className="font-semibold">Title</TableCell>
                                    <TableCell className="font-semibold">Company</TableCell>
                                    <TableCell className="font-semibold">Location</TableCell>
                                    <TableCell className="font-semibold">Job Type</TableCell>
                                    <TableCell className="font-semibold">Salary</TableCell>
                                    <TableCell align="center" className="font-semibold">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredJobPosts
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((job) => (
                                        <TableRow key={job.id} className="hover:bg-gray-50 transition-colors">
                                            <TableCell>{job.id}</TableCell>
                                            <TableCell className="font-medium">{job.title}</TableCell>
                                            <TableCell>{job.companyName}</TableCell>
                                            <TableCell>{job.location}</TableCell>
                                            <TableCell>{job.jobType}</TableCell>
                                            <TableCell>{job.salary}</TableCell>
                                            <TableCell align="center">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => handleOpenModal(job, true)}
                                                        className="px-3 py-1 cursor-pointer text-sm bg-blue-500 text-white hover:text-black rounded hover:bg-blue-50 flex items-center gap-1"
                                                    >
                                                        <FaEdit /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteJobPost(job.id)}
                                                        className="px-3 py-1 text-sm bg-red-500 text-white hover:text-black cursor-pointer rounded hover:bg-red-50 flex items-center gap-1"
                                                    >
                                                        <FaTrash /> Delete
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={filteredJobPosts.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 20, 50]}
                    />
                </Paper>

                {/* Modal for Create/Edit Job Post */}
                <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm" className="rounded-lg">
                    <DialogTitle className="bg-gray-50">
                        <h2 className="text-xl font-semibold">
                            {isEdit ? 'Edit Job Post' : 'Create New Job Post'}
                        </h2>
                    </DialogTitle>

                    <DialogContent className="mt-4">
                        <div className="flex flex-col gap-3">
                            <TextField
                                label="Title"
                                name="title"
                                fullWidth
                                variant="outlined"
                                value={formData.title}
                                onChange={handleFormChange}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                value={formData.description}
                                onChange={handleFormChange}
                            />
                            <TextField
                                label="Company Name"
                                name="companyName"
                                fullWidth
                                variant="outlined"
                                value={formData.companyName}
                                onChange={handleFormChange}
                            />
                            <TextField
                                label="Location"
                                name="location"
                                fullWidth
                                variant="outlined"
                                value={formData.location}
                                onChange={handleFormChange}
                            />
                            <TextField
                                select
                                label="Job Type"
                                name="jobType"
                                fullWidth
                                variant="outlined"
                                value={formData.jobType}
                                onChange={handleFormChange}
                            >
                                {jobTypes.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Salary"
                                name="salary"
                                fullWidth
                                variant="outlined"
                                type="number"
                                value={formData.salary}
                                onChange={handleFormChange}
                            />

                        </div>
                    </DialogContent>

                    <DialogActions className="p-4">
                        <Button onClick={handleCloseModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                            {isEdit ? 'Update Job Post' : 'Create Job Post'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Layout>
    );
}

export default ManageJobPosts;
