'use client'
import { useState } from 'react';
import { GoSearch } from "react-icons/go";
import { BiLogOutCircle } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import { Link, useLocation } from 'react-router-dom';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const userToken = localStorage.getItem("user-token")
    const handleLogout = () => {

        localStorage.removeItem("user-token")

        window.location.pathname = "/"
        // window.location.reload()
    }
    const location = useLocation();
    const path = location.pathname;
    console.log("🚀 ~ Footer ~ path:", path)
    if (path.startsWith("/profile")) {
        return
    }
    return (
        <div>
            <nav className="bg-white border-gray-200 py-2.5 ">
                <div className="flex flex-wrap items-center sm:justify-between justify-center  px-4 mx-auto">
                    <Link to="/" >
                        <img src="/logo.png" alt="" className='h-14' />

                    </Link>
                    <div className="flex items-center gap-x-12 mt-5 ml-2  sm:gap-x-0 sm:mt-0 sm:ml-0 lg:order-2">
                        <div className="hidden mt-2 mr-4 sm:inline-block">
                            <span></span>
                        </div>
                        {
                            userToken ?
                                <div className=' flex items-center gap-x-1'>

                                    <Link
                                        to="/profile"
                                        className="text-white border-blue-500 border-2 bg-blue-500 hover:bg-blue-700 hover:border-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0  focus:outline-none "
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="text-white border-red-500 border-2 bg-red-500 hover:bg-red-700 hover:border-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm h-10 flex items-center justify-center cursor-pointer w-10  focus:outline-none "
                                    >
                                        <BiLogOutCircle size={22} />
                                    </button>

                                </div>

                                :
                                <div className=' flex items-center gap-x-4'>


                                    <Link
                                        to="/register"
                                        className="text-white border-blue-500 border-2 bg-blue-500 hover:bg-blue-700 hover:border-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0  focus:outline-none "

                                    >
                                        SignUp
                                    </Link>
                                    <Link
                                        to="/login"
                                        className=" border-2 border-blue-500 text-blue-900 transition-all hover:bg-blue-700 hover:border-blue-700 hover:text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 focus:outline-none"
                                    >
                                        LogIn
                                    </Link>
                                </div>
                        }
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            aria-controls="mobile-menu-2"
                            aria-expanded={isMenuOpen ? 'true' : 'false'}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className={`w-6 h-6 ${isMenuOpen ? 'hidden' : ''}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <svg
                                className={`w-6 h-6 ${isMenuOpen ? '' : 'hidden'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                    </div>
                    <div
                        className={`${isMenuOpen ? 'block' : 'hidden'
                            } items-center justify-between w-full lg:flex lg:w-auto lg:order-1`}
                        id="mobile-menu-2"
                    >
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <Link
                                    to="/"
                                    className="block py-2 font-semibold pl-3 pr-4 text-gray-700 b rounded lg:bg-transparent lg:hover:text-blue-500 lg:p-0 "
                                    aria-current="page"
                                >
                                    <span className='flex items-center gap-x-1'>

                                        <AiOutlineHome size={20} />
                                        Home
                                    </span>
                                </Link>
                            </li>

                            <li>
                                <Link to="/jobs"
                                    className="block font-semibold py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-blue-500 lg:p-0">
                                    <span className='flex items-center gap-x-1'>
                                        <GoSearch size={20} />
                                        Search Your Next Job
                                    </span>
                                </Link>
                            </li>


                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;