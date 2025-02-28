'use client';

import { useState, useRef } from 'react';
import signUpImage from '/Add friends.gif';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable'; // Import CreatableSelect

export default function Register() {
    const navigate = useNavigate();
    const passwordRef = useRef(null);

    // Step state (1: basic info, 2: additional info)
    const [step, setStep] = useState(1);

    // Basic information
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('EMPLOYEE');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Additional fields for Employee
    const [skills, setSkills] = useState([]);
    const [education, setEducation] = useState([]);
    const [experience, setExperience] = useState('');

    // Additional fields for Employer
    const [companyName, setCompanyName] = useState('');
    const [location, setLocation] = useState('');

    // Sample options for education multi-select (employee)
    const educationOptions = [
        { value: 'highSchool', label: 'High School' },
        { value: 'bachelor', label: "Bachelor's" },
        { value: 'master', label: "Master's" },
        { value: 'phd', label: 'PhD' },
    ];

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    // Handler to move from Step 1 to Step 2
    const handleNext = (e) => {
        e.preventDefault();
        if (!fullName || !email || !password) {
            toast.error('All fields are required');
            return;
        }
        setStep(2);
    };

    // Final submit handler (for step 2)
    const submitForm = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Build the payload with basic info
        let payload = { fullName, email, password, role };

        if (role === 'EMPLOYEE') {
            if (skills.length === 0 || education.length === 0 || !experience) {
                toast.error('Please fill out all employee fields');
                setLoading(false);
                return;
            }
            payload = {
                ...payload,
                skills: skills.map((s) => s.value),
                education: education.map((edu) => edu.value),
                experience,
            };
        } else if (role === 'EMPLOYER') {
            if (!companyName || !location) {
                toast.error('Please fill out all employer fields');
                setLoading(false);
                return;
            }
            payload = {
                ...payload,
                companyName,
                location,
            };
        }

        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/register`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }
            );

            if (res.ok) {
                toast.success('We Send an Email Please Verify Your Account');
                navigate('/');
            } else {
                toast.error('Something went wrong');
            }
        } catch (error) {
            console.error("🚀 ~ submitForm ~ error:", error);
            toast.error('Server Error');
        }
        setLoading(false);
    };

    return (
        <div className="bg-white">
            <div className="mx-auto">
                <div className="flex justify-center px-6">
                    <div className="w-full grid lg:grid-cols-2 grid-cols-1">
                        <div className="w-full h-auto flex justify-center rounded-l-lg">
                            <img src={signUpImage} alt="signup" className="w-full h-[500px]" />
                        </div>
                        <div className="w-full bg-white p-5">
                            <h3 className="pt-4 text-start text-lg md:text-4xl text-[#034694] font-bold">
                                {step === 1 ? "SignUp!" : "Additional Information"}
                            </h3>
                            <h3 className="text-start mt-0.5 text-[#034694]">
                                {step === 1
                                    ? "Register Your Account Now!"
                                    : "Complete your profile"}
                            </h3>
                            <form
                                onSubmit={step === 1 ? handleNext : submitForm}
                                className="pt-6 pb-4 bg-white rounded transition-all duration-500"
                            >
                                {step === 1 && (
                                    <>
                                        <div className="grid py-2 grid-cols-2 gap-4">
                                            <div className="h-full">
                                                <label
                                                    className="block mb-2 text-start text-sm text-black"
                                                    htmlFor="fullName"
                                                >
                                                    Full Name
                                                </label>
                                                <input
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    value={fullName}
                                                    className="w-full p-3 text-sm text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                                                    id="fullName"
                                                    type="text"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="h-full">
                                                <label
                                                    className="block mb-2 text-start text-sm text-black"
                                                    htmlFor="email"
                                                >
                                                    Email
                                                </label>
                                                <input
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    value={email}
                                                    className="w-full p-3 text-sm text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                                                    id="email"
                                                    type="email"
                                                    placeholder="yourmail@gmail.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label
                                                className="block my-2 text-start text-sm text-black"
                                                htmlFor="password"
                                            >
                                                Password
                                            </label>
                                            <div className="flex relative">
                                                <input
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    value={password}
                                                    ref={passwordRef}
                                                    className="w-full p-3 text-sm text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="******************"
                                                />
                                                <div
                                                    className="absolute top-3 right-4 cursor-pointer text-[#034694]"
                                                    onClick={togglePasswordVisibility}
                                                >
                                                    {showPassword ? (
                                                        <AiFillEyeInvisible size={25} />
                                                    ) : (
                                                        <AiFillEye size={25} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid py-4 grid-cols-2 pb-6 gap-4">
                                            <span
                                                onClick={() => setRole('EMPLOYEE')}
                                                className={`border cursor-pointer p-3 rounded-md ${role === 'EMPLOYEE'
                                                    ? 'border-[#034694] bg-blue-50'
                                                    : 'border-gray-400 hover:bg-blue-50'
                                                    }`}
                                            >
                                                I am an Employee
                                            </span>
                                            <span
                                                onClick={() => setRole('EMPLOYER')}
                                                className={`border cursor-pointer p-3 rounded-md ${role === 'EMPLOYER'
                                                    ? 'border-[#034694] bg-blue-50'
                                                    : 'border-gray-400 hover:bg-blue-50'
                                                    }`}
                                            >
                                                I am an Employer
                                            </span>
                                        </div>
                                        <div className="mb-6 mt-5 cursor-pointer text-center">
                                            <button
                                                className="w-full px-4 cursor-pointer py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-800 focus:outline-none focus:shadow-outline"
                                                type="submit"
                                            >
                                                Next
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap mt-3 justify-center">
                                            <Link
                                                className="text-sm text-blue-500 hover:text-blue-800"
                                                to="/login"
                                            >
                                                Already have an account? Log In!
                                            </Link>
                                        </div>
                                    </>
                                )}
                                {step === 2 && (
                                    <>
                                        {role === 'EMPLOYEE' && (
                                            <>
                                                <div className="grid py-4 md:grid-cols-2 pb-6 gap-4">

                                                    <div className="mb-4">
                                                        <label className="block mb-2 text-start text-sm text-black">
                                                            Skills
                                                        </label>
                                                        <CreatableSelect
                                                            isMulti

                                                            value={skills}
                                                            onChange={setSkills}
                                                            placeholder="Type your skill and press enter"
                                                            formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                                                        />
                                                    </div>
                                                    <div className="my-4">
                                                        <label className="block mb-2 text-start text-sm text-black">
                                                            Education
                                                        </label>
                                                        <CreatableSelect
                                                            isMulti
                                                            options={educationOptions}
                                                            value={education}
                                                            onChange={setEducation}
                                                            placeholder="Select or type your education"
                                                            formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-4">
                                                    <label
                                                        className="block mb-2 text-start text-sm text-black"
                                                        htmlFor="experience"
                                                    >
                                                        Years of Experience
                                                    </label>
                                                    <input
                                                        onChange={(e) => setExperience(e.target.value)}
                                                        value={experience}
                                                        className="w-full p-3 text-sm text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                                                        id="experience"
                                                        type="number"
                                                        placeholder="e.g., 3"
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {role === 'EMPLOYER' && (
                                            <>
                                                <div className="grid py-4 md:grid-cols-2 pb-6 gap-4">

                                                    <div className="mb-4">
                                                        <label
                                                            className="block mb-2 text-start text-sm text-black"
                                                            htmlFor="companyName"
                                                        >
                                                            Company Name
                                                        </label>
                                                        <input
                                                            onChange={(e) => setCompanyName(e.target.value)}
                                                            value={companyName}
                                                            className="w-full p-3 text-sm text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                                                            id="companyName"
                                                            type="text"
                                                            placeholder="Company Name"
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <label
                                                            className="block mb-2 text-start text-sm text-black"
                                                            htmlFor="location"
                                                        >
                                                            Company Location
                                                        </label>
                                                        <input
                                                            onChange={(e) => setLocation(e.target.value)}
                                                            value={location}
                                                            className="w-full p-3 text-sm text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                                                            id="location"
                                                            type="text"
                                                            placeholder="Company Location"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        <div className="flex justify-between pt-10">
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="px-4 py-2 cursor-pointer font-bold text-blue-500 border border-blue-500 rounded-full hover:bg-blue-50 focus:outline-none"
                                            >
                                                Back
                                            </button>
                                            <button
                                                className="px-4 cursor-pointer py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-800 focus:outline-none"
                                                type="submit"
                                            >
                                                {loading ? 'Submitting...' : 'Create Account'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
