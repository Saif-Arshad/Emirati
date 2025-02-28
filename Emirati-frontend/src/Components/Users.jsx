import { useState, useEffect } from 'react';
import Layout from './shared/SidebarLayout';
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
} from '@mui/material';
import CreatableSelect from 'react-select/creatable';
import { FaEdit, FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa'; // For password toggle icon
import { toast } from 'react-toastify';

function Users() {
    // State for users and filters
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filterRole, setFilterRole] = useState('');

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Modal (Create/Edit) states
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // ---------- MULTI-STEP FORM STATES ----------
    // step = 1 => Basic Info, step = 2 => Extra Info
    const [step, setStep] = useState(1);

    // For toggling password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Form data (used for Create, and partially for Edit)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: '',
        // Employee fields
        skills: [],
        educationList: [],
        experience: '',
        // Employer fields
        companyName: '',
        location: '',
    });

    // Fetch all users on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Update filtered users when search or filter changes
    useEffect(() => {
        let filtered = users;
        if (searchText) {
            filtered = filtered.filter(
                (u) =>
                    u.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        if (filterRole) {
            filtered = filtered.filter((u) => u.role === filterRole);
        }
        setFilteredUsers(filtered);
        setPage(0);
    }, [searchText, filterRole, users]);

    // API call to fetch users
    const fetchUsers = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`);
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
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

    // ------------------ OPEN CREATE/EDIT MODAL ------------------
    const handleOpenModal = (user = null, edit = false) => {
        setSelectedUser(user);
        setIsEdit(edit);

        if (user && edit) {
            // Edit mode: admin can ONLY edit fullName, email (per your requirement).
            setFormData((prev) => ({
                ...prev,
                fullName: user.fullName,
                email: user.email,
                // We won't change password or role for editing
                password: '',
                role: user.role,
                // If you want to disable the role selection for editing, you can do so in UI
                skills: [],
                educationList: [],
                experience: '',
                companyName: '',
                location: '',
            }));
            // We don't need to do step 2 for editing name/email only,
            // but you can adapt logic if you also want to edit role-specific info here.
            setStep(1);
        } else {
            // Create mode: Clear form
            setFormData({
                fullName: '',
                email: '',
                password: '',
                role: '',
                skills: [],
                educationList: [],
                experience: '',
                companyName: '',
                location: '',
            });
            setStep(1);
        }

        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedUser(null);
        setIsEdit(false);
        setShowPassword(false);
        // Reset step to 1 for safety
        setStep(1);
        // Clear form data
        setFormData({
            fullName: '',
            email: '',
            password: '',
            role: '',
            skills: [],
            educationList: [],
            experience: '',
            companyName: '',
            location: '',
        });
    };

    // ------------------ FORM CHANGE HANDLER ------------------
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ------------------ SUBMIT (CREATE OR UPDATE) ------------------
    const handleSubmit = async () => {
        if (isEdit && selectedUser) {
            // EDIT USER: Only name/email
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${selectedUser.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName: formData.fullName,
                        email: formData.email,
                    }),
                });
                if (res.ok) {
                    fetchUsers();
                    handleCloseModal();
                } else {
                    console.error('Failed to update user');
                }
            } catch (error) {
                console.error('Error updating user:', error);
            }
        } else {
            // CREATE NEW USER (include all fields)
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName: formData.fullName,
                        email: formData.email,
                        password: formData.password,
                        role: formData.role,
                        // Conditionally pass extra data if it's relevant:
                        // For EMPLOYEE
                        skills: formData.role === 'EMPLOYEE' ? formData.skills : [],
                        educationList: formData.role === 'EMPLOYEE' ? formData.educationList : [],
                        experience: formData.role === 'EMPLOYEE' ? formData.experience : '',
                        // For EMPLOYER
                        companyName: formData.role === 'EMPLOYER' ? formData.companyName : '',
                        location: formData.role === 'EMPLOYER' ? formData.location : '',
                    }),
                });
                if (res.ok) {
                    fetchUsers();
                    handleCloseModal();
                } else {
                    console.error('Failed to create user');
                }
            } catch (error) {
                console.error('Error creating user:', error);
            }
        }
    };

    // ------------------ DELETE USER ------------------
    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${userId}`, {
                    method: 'DELETE',
                });
                if (res.ok) {
                    fetchUsers();
                } else {
                    console.error('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    // ------------------ STEP NAVIGATION (Create) ------------------
    const handleNextStep = () => {
        if (!formData.fullName || !formData.email || (!isEdit && !formData.password) || !formData.role) {
            toast.error('Please fill all required fields before proceeding.');
            return;
        }
        setStep(2);
    };

    const handlePreviousStep = () => {
        setStep(1);
    };

    // Options for react-select
    const skillsOptions = [
    ];

    const educationOptions = [

    ];

    return (
        <Layout>
            <div className="p-6">
                <div className="mb-8">
                    <div className="flex flex-wrap gap-4 items-center bg-white p-6 rounded-lg shadow-sm">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="p-2 border rounded"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="p-2 border rounded min-w-[200px]"
                        >
                            <option value="">All Roles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="EMPLOYEE">Employee</option>
                            <option value="EMPLOYER">Employer</option>
                            <option value="GOVT">Government</option>
                        </select>
                        <button
                            onClick={() => handleOpenModal(null, false)}
                            className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-full ml-auto"
                        >
                            + Add New User
                        </button>
                    </div>
                </div>

                {/* Users Table */}
                <Paper className="rounded-lg shadow-md overflow-hidden">
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow className="bg-gray-50">
                                    <TableCell className="font-semibold">ID</TableCell>
                                    <TableCell className="font-semibold">Full Name</TableCell>
                                    <TableCell className="font-semibold">Email</TableCell>
                                    <TableCell className="font-semibold">Role</TableCell>
                                    <TableCell align="center" className="font-semibold">
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredUsers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((user) => (
                                        <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <TableCell>{user.id}</TableCell>
                                            <TableCell className="font-medium">{user.fullName}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm ${user.role === 'ADMIN'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : user.role === 'EMPLOYEE'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : user.role === 'EMPLOYER'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </TableCell>
                                            <TableCell align="center">
                                                <div className="flex gap-2 justify-center">
                                                   
                                                    <button
                                                        onClick={() => handleOpenModal(user, true)}
                                                        className="px-3 py-1 cursor-pointer text-sm bg-blue-500 text-white hover:text-black rounded hover:bg-blue-50 flex items-center gap-1"
                                                    >
                                                        <FaEdit /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
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
                        count={filteredUsers.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 20, 50]}
                    />
                </Paper>

                <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm" className="rounded-lg">
                    <DialogTitle className="bg-gray-50">
                        <h2 className="text-xl font-semibold">
                            {isEdit ? 'Edit User (Basic Info)' : 'Create New User'}
                        </h2>
                    </DialogTitle>

                    <DialogContent className="mt-4">
                        {step === 1 && (
                            <div className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.fullName}
                                        onChange={handleFormChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                    />
                                </div>
                                </div>

                                {!isEdit && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                                                    value={formData.password}
                                                    onChange={handleFormChange}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                            <select
                                                name="role"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                                value={formData.role}
                                                onChange={handleFormChange}
                                            >
                                                <option value="">Select Role</option>
                                                <option value="EMPLOYEE">Employee</option>
                                                <option value="EMPLOYER">Employer</option>
                                                <option value="ADMIN">Admin</option>
                                                <option value="GOVT">Government official</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {step === 2 && !isEdit && (
                            <div className="space-y-6">
                                {formData.role === 'EMPLOYEE' && (
                                    <>
                                        <TextField
                                            label="Experience"
                                            name="experience"
                                            fullWidth
                                            type='number'
                                            variant="outlined"
                                            value={formData.experience}
                                            onChange={handleFormChange}
                                        />
                                        <div className="pt-3">

                                            <label className="block mb-1 font-medium">Skills</label>
                                            <CreatableSelect
                                                isMulti
                                                options={skillsOptions}
                                                value={formData.skills.map((s) => ({ value: s, label: s }))}
                                                onChange={(selected) => {
                                                    const values = selected ? selected.map((option) => option.value) : [];
                                                    setFormData((prev) => ({ ...prev, skills: values }));
                                                }}
                                            />
                                        </div>

                                        <div className="py-3">
                                            <label className="block mb-1 font-medium">Education</label>
                                            <CreatableSelect
                                                isMulti
                                                options={educationOptions}
                                                value={formData.educationList.map((e) => ({ value: e, label: e }))}
                                                onChange={(selected) => {
                                                    const values = selected ? selected.map((option) => option.value) : [];
                                                    setFormData((prev) => ({ ...prev, educationList: values }));
                                                }}
                                            />
                                        </div>


                                    </>
                                )}

                                {formData.role === 'EMPLOYER' && (
                                    <>
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
                                    </>
                                )}

                                {formData.role !== 'EMPLOYEE' && formData.role !== 'EMPLOYER' && (
                                    <p className="text-gray-500">No extra fields for this role.</p>
                                )}
                            </div>
                        )}
                    </DialogContent>

                    <DialogActions className="p-4">
                        <button
                            onClick={handleCloseModal}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>

                        {!isEdit && step === 1 && (
                            <button
                                onClick={handleNextStep}
                                className="px-6 cursor-pointer py-2 bg-blue-600  hover:bg-blue-700 text-white rounded-full"
                            >
                                Next
                            </button>
                        )}

                        {/* Step 2 & Creating => Show 'Back' and 'Create User' */}
                        {!isEdit && step === 2 && (
                            <>
                                <button
                                    onClick={handlePreviousStep}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 cursor-pointer py-2 bg-blue-600  hover:bg-blue-700 text-white rounded-full"

                                >
                                    Create User
                                </button>
                            </>
                        )}

                        {isEdit && (
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white rounded-full"
                            >
                                Update User
                            </button>
                        )}
                    </DialogActions>
                </Dialog>
            </div>
        </Layout>
    );
}

export default Users;
