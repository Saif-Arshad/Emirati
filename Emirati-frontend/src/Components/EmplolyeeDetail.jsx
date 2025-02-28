import { useState, useEffect } from 'react';
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

function EmployeeAppliedDetail() {
    const { id } = useParams(); // Extract employee id from the URL e.g., /profile/employee-monitoring/21
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployeeAppliedDetails = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/govt/employees/${id}/applications`
                );
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || 'Failed to fetch employee details');
                } else {
                    setEmployee(data);
                }
            } catch (err) {
                console.error('Error fetching employee applied details:', err);
                setError('Failed to fetch employee details');
            }
        };

        fetchEmployeeAppliedDetails();
    }, [id]);

    const handleOpenDialog = (application) => {
        setSelectedApplication(application);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedApplication(null);
    };

    // Format the date to a format like "19 Jan 2024"
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

    if (!employee) {
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
                    Job Applied Details for {employee.fullName}
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Job Title</TableCell>
                                <TableCell>Company Name</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Applied At</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {employee.Apply && employee.Apply.length > 0 ? (
                                employee.Apply.map((application) => (
                                    <TableRow key={application.id}>
                                        <TableCell>{application.JobPost.title}</TableCell>
                                        <TableCell>{application.JobPost.companyName}</TableCell>
                                        <TableCell>{application.JobPost.location}</TableCell>
                                        <TableCell>{formatDate(application.appliedAt)}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleOpenDialog(application)}
                                            >
                                                Detail
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5}>No applications found.</TableCell>
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

            {/* Modal Dialog to show application detail */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Application Detail</DialogTitle>
                <DialogContent dividers>
                    {selectedApplication && (
                        <>
                            <Typography variant="subtitle1">
                                <strong>Job Title:</strong> {selectedApplication.JobPost.title}
                            </Typography>
                            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                                <strong>Cover Letter:</strong>
                            </Typography>
                            <Typography variant="body2">
                                {selectedApplication.cover_letter || 'N/A'}
                            </Typography>
                            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                                <strong>Experience:</strong>
                            </Typography>
                            <Typography variant="body2">
                                {selectedApplication.experience || 'N/A'}
                            </Typography>
                            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                                <strong>Job Description:</strong>
                            </Typography>
                            <Typography variant="body2">
                                {selectedApplication.JobPost.description || 'N/A'}
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

export default EmployeeAppliedDetail;
