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

function EmployeeMonitoring() {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                // Call your API for Emirati employees
                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/govt/employees`
                );
                const data = await res.json();
                setEmployees(data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

    // Filter employees by full name or email using the search term
    const filteredEmployees = employees.filter((emp) => {
        return (
            emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

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
                <div className="flex items-start">

                <TextField
                    label="Search Employees"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ marginBottom: '20px' }}
                    />
                    </div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Emirati ID</TableCell>
                                <TableCell>Verified</TableCell>
                                <TableCell>Apply Count</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEmployees
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell>{employee.fullName}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>{employee.emiratiID}</TableCell>
                                        <TableCell>{employee.isVerified ? "Yes" : "No"}</TableCell>
                                        <TableCell>{employee._count?.Apply || 0}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() =>
                                                    navigate(
                                                        `/profile/employee-monitoring/${employee.id}`
                                                    )
                                                }
                                            >
                                                Apply Detail
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={filteredEmployees.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10]}
                />
            </div>
        </Layout>
    );
}

export default EmployeeMonitoring;
