import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from './shared/SidebarLayout';
import {
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';

function EmployerJobPostsDetail() {
    const { id } = useParams(); // Extract employer ID from URL (e.g., /profile/employer-monitoring/21)
    const [employer, setEmployer] = useState(null);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedJobPost, setSelectedJobPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployerJobPosts = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/govt/employers/${id}/job-posts`
                );
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || 'Failed to fetch employer details');
                } else {
                    setEmployer(data);
                }
            } catch (err) {
                console.error('Error fetching employer job posts:', err);
                setError('Failed to fetch employer job posts');
            }
        };

        fetchEmployerJobPosts();
    }, [id]);

    const handleOpenDialog = (jobPost) => {
        setSelectedJobPost(jobPost);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedJobPost(null);
    };

    // Format date to a format like "19 Jan 2024"
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    if (error) {
        return (
            <Layout>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </Layout>
        );
    }

    if (!employer) {
        return (
            <Layout>
                <Typography>Loading...</Typography>
            </Layout>
        );
    }

    return (
        <Layout>
            <Paper style={{ padding: '20px', margin: '20px' }}>
                <Typography variant="h5" gutterBottom>
                    Job Posts for {employer.fullName}
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Job Title</TableCell>
                                <TableCell>Company Name</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Posted At</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employer.JobPost && employer.JobPost.length > 0 ? (
                                employer.JobPost.map((job) => (
                                    <TableRow key={job.id}>
                                        <TableCell>{job.title}</TableCell>
                                        <TableCell>{job.companyName}</TableCell>
                                        <TableCell>{job.location}</TableCell>
                                        <TableCell>{formatDate(job.postedAt)}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleOpenDialog(job)}
                                            >
                                                Detail
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5}>No job posts found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button
                    variant="contained"
                    onClick={() => navigate(-1)}
                    style={{ marginTop: '20px' }}
                >
                    Back
                </Button>
            </Paper>

            {/* Dialog for Job Post Details */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Job Post Detail</DialogTitle>
                <DialogContent dividers>
                    {selectedJobPost && (
                        <>
                            <Typography variant="subtitle1">
                                <strong>Job Title:</strong> {selectedJobPost.title}
                            </Typography>
                            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                                <strong>Company Name:</strong> {selectedJobPost.companyName}
                            </Typography>
                            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                                <strong>Location:</strong> {selectedJobPost.location}
                            </Typography>
                            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                                <strong>Job Type:</strong> {selectedJobPost.jobType}
                            </Typography>
                            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                                <strong>Salary:</strong> {selectedJobPost.salary || 'N/A'}
                            </Typography>
                            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                                <strong>Status:</strong> {selectedJobPost.status}
                            </Typography>
                            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                                <strong>Job Description:</strong>
                            </Typography>
                            <Typography variant="body2">
                                {selectedJobPost.description}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
}

export default EmployerJobPostsDetail;
