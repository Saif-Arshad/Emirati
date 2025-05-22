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
    Grid,
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
            <div style={{ padding: '20px' }}>
                {/* Company Statistics Section */}
                {employer && employer.Employer && employer.Employer[0] && (
                    <Paper style={{ padding: '24px', marginBottom: '24px' }}>
                        <Typography variant="h5" gutterBottom>
                            Company Overview: {employer.fullName}
                        </Typography>
                        <Grid container spacing={3} style={{ marginTop: '16px' }}>
                            <Grid item xs={12} md={3}>
                                <Paper elevation={0} style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Total Staff
                                    </Typography>
                                    <Typography variant="h6">
                                        {employer.Employer[0].staff || '0'}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Paper elevation={0} style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Emirati Staff
                                    </Typography>
                                    <Typography variant="h6">
                                        {employer.Employer[0].emiratiStaff || '0'}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Paper 
                                    elevation={0} 
                                    style={{ 
                                        padding: '16px', 
                                        backgroundColor: Number(employer.Employer[0].currentEmiratiPercentage) >= Number(employer.Employer[0].targetEmirati)
                                            ? '#f0f9f0'  // Light green background if target met
                                            : '#fff4e5', // Light yellow background if target not met
                                        borderRadius: '8px'
                                    }}
                                >
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Current Emirati Percentage
                                    </Typography>
                                    <Typography variant="h6">
                                        {employer.Employer[0].currentEmiratiPercentage || '0'}%
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Paper elevation={0} style={{ padding: '16px', backgroundColor: '#f0f7ff', borderRadius: '8px' }}>
                                    <Typography variant="subtitle2" color="textSecondary">
                                        Target Emirati Percentage
                                    </Typography>
                                    <Typography variant="h6">
                                        {employer.Employer[0].targetEmirati || '0'}%
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                        <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Status
                            </Typography>
                            <div style={{ 
                                display: 'inline-block',
                                padding: '8px 16px',
                                borderRadius: '16px',
                                backgroundColor: Number(employer.Employer[0].currentEmiratiPercentage) >= Number(employer.Employer[0].targetEmirati)
                                    ? '#e8f5e9'
                                    : '#fff3e0',
                                color: Number(employer.Employer[0].currentEmiratiPercentage) >= Number(employer.Employer[0].targetEmirati)
                                    ? '#2e7d32'
                                    : '#ed6c02'
                            }}>
                                {Number(employer.Employer[0].currentEmiratiPercentage) >= Number(employer.Employer[0].targetEmirati)
                                    ? 'Target Met'
                                    : 'In Progress'}
                            </div>
                        </div>
                    </Paper>
                )}

                {/* Existing Job Posts Section */}
                <Paper style={{ padding: '20px' }}>
                    <Typography variant="h5" gutterBottom>
                        Job Posts
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
            </div>

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
