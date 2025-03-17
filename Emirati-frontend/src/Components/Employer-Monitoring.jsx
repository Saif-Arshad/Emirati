import { useState, useEffect } from 'react';
import Layout from './shared/SidebarLayout';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    TextField,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function EmployerMonitoring() {
    const [employers, setEmployers] = useState([]);
    console.log("🚀 ~ EmployerMonitoring ~ employers:", employers)
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployers = async () => {
            try {
                // Call your API for Emirati employers
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/govt/employers`
                );
                const data = await res.json();
                console.log("Fetched employers:", data);
                setEmployers(data);
            } catch (error) {
                console.error('Error fetching employers:', error);
            }
        };

        fetchEmployers();
    }, []);

    // Filter employers by full name or email using the search term
    const filteredEmployers = employers.filter((employer) => {
        return (
            employer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employer.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });
    console.log("🚀 ~ filteredEmployers ~ filteredEmployers:", filteredEmployers)

    // Pagination handler
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Search input change handler
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0); // reset to first page when searching
    };

    return (
        <Layout>
            <div style={{ padding: '20px' }}>
                <TextField
                    label="Search Employers"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ marginBottom: '20px' }}
                />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Emirati ID</TableCell>
                                <TableCell>Total Staff</TableCell>
                                <TableCell>Emirati Staff</TableCell>
                                <TableCell>Emirati Staff Percentage</TableCell>
                                <TableCell>Verified</TableCell>
                                <TableCell>Job Posts Count</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmployers
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((employer) => (
                                    <TableRow key={employer.id}>
                                        <TableCell>{employer.fullName}</TableCell>
                                        <TableCell>{employer.email}</TableCell>
                                        <TableCell>{employer.emiratiID}</TableCell>
                                        <TableCell>{employer.Employer[0]?.staff}</TableCell>
                                        <TableCell>{employer.Employer[0]?.emiratiStaff}</TableCell>
                                        <TableCell>{employer.Employer[0]?.currentEmiratiPercentage}%</TableCell>
                                        <TableCell>{employer.isVerified ? "Yes" : "No"}</TableCell>
                                        <TableCell>{employer._count?.JobPost || 0}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() =>
                                                    navigate(`/profile/employer-monitoring/${employer.id}`)
                                                }
                                            >
                                                Detail
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={filteredEmployers.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10]}
                />
            </div>
        </Layout>
    );
}

export default EmployerMonitoring;
