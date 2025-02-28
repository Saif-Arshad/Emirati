'use client';

import { useState } from 'react';
import loginImage from '/Tablet login.gif';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!email || !password) {
            toast.error('All fields are required');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const response = await res.json()
            localStorage.setItem("user-token", JSON.stringify(response.token))
            localStorage.setItem("user-role", JSON.stringify(response.user.role))

            console.log("🚀 ~ submitForm ~ res:", response)
            if (res.ok) {
                toast.success('Login Successful');
                window.location.pathname = "/"

            } else {
                toast.error('Invalid credentials');
            }
        } catch (error) {
            console.log("🚀 ~ submitForm ~ error:", error)
            toast.error('Server Error');
        }
        setLoading(false);
    };

    return (
        <div className=" bg-white">
            <div className="mx-auto">
                <div className="flex justify-center px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="w-full h-auto flex  justify-center rounded-l-lg">
                            <img src={loginImage} alt='login' className="w-full h-[500px]" />
                        </div>
                        <div className="w-full  bg-white p-5">
                            <h3 className="pt-4 text-start text-lg md:text-4xl text-[#034694] font-bold">SignIn!</h3>
                            <h3 className="text-start mt-0.5 text-[#034694] ">Login to Your Account!</h3>
                            <form onSubmit={submitForm} className=" pt-6 pb-4 bg-white rounded">
                                <div className="mb-4">
                                    <label className="block my-2 text-start text-sm text-black" htmlFor="email">Email</label>
                                    <input
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full   p-3 text-sm text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"

                                        id="email"
                                        type="email"
                                        placeholder="yourmail@gmail.com"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block my-2 text-start text-sm text-black" htmlFor="password">Password</label>
                                    <div className="flex relative">
                                        <input
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full  p-3 text-sm text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"

                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="******************"
                                        />
                                        <div className='absolute top-3 right-4 cursor-pointer text-[#034694]' onClick={togglePasswordVisibility}>
                                            {showPassword ? <AiFillEyeInvisible size={25} /> : <AiFillEye size={25} />}
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-6 pt-5 text-center">
                                    <button className="w-full px-4 py-2 cursor-pointer font-bold text-white bg-blue-500 rounded-full hover:bg-blue-800 focus:outline-none focus:shadow-outline" type="submit">
                                        {loading ? 'Logging in...' : 'Login'}
                                    </button>
                                </div>
                                <div className="flex flex-wrap justify-center">
                                    <Link className="text-sm text-blue-500 hover:text-blue-800" to="/register">Don&apos;t have an account? Sign Up!</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
