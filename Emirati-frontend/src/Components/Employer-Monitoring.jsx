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
                                <TableCell>Current Emirati Percentage</TableCell>
                                <TableCell>Target Emirati Percentage</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Job Posts</TableCell>
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
                                        <TableCell>
                                            <div className={`px-3 py-1 rounded-full text-sm inline-block ${
                                                Number(employer.Employer[0]?.currentEmiratiPercentage) >= Number(employer.Employer[0]?.targetEmirati)
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {employer.Employer[0]?.currentEmiratiPercentage}%
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="px-3 py-1 rounded-full text-sm inline-block bg-blue-100 text-blue-800">
                                                {employer.Employer[0]?.targetEmirati}%
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {Number(employer.Employer[0]?.currentEmiratiPercentage) >= Number(employer.Employer[0]?.targetEmirati)
                                                ? <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">Target Met</span>
                                                : <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">In Progress</span>
                                            }
                                        </TableCell>
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
