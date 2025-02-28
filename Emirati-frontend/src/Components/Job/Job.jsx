import { useEffect, useState } from "react";
import { BiDollar, BiUser } from "react-icons/bi";
import { BsClock } from "react-icons/bs";
import {  FaSearch } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Job() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jobDetail, setJobDetail] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [filters, setFilters] = useState({
        title: "",
        location: "",
        jobType: "",
        salary: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const itemsPerPage = 10;
    const role = localStorage.getItem("user-role");
    console.log("🚀 ~ Job ~ role:", role)
    const userRole = role && role.replace(/"/g, "");

    const token = localStorage.getItem("user-token");
    let navigate = useNavigate();
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getAllJobs = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/job/get-all`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                }
            );
            if (!response.ok) {
                toast.error("Error Getting jobs");
            }
            const res = await response.json();
            console.log("🚀 ~ getAllJobs ~ res:", res);
            setData(res);
            setFilteredJobs(res); // Initialize filteredJobs with all jobs
            if (res.length > 0) {
                setJobDetail(res[0]);
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllJobs();
    }, []);

    const detail = (id) => {
        const selectedJob = data.find((item) => item.id === id);
        if (selectedJob) {
            setJobDetail(selectedJob);
            if (isMobile) setShowDetail(true);
        } else {
            toast.error("Job not found");
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        console.log("🚀 ~ handleFilterChange ~ name:", name)
        setFilters((prev) => ({ ...prev, [name]: value }));
        setCurrentPage(1);
        // filterJobs({ ...filters, [name]: value });
    };

    const filterJobs = (filters) => {
        const filtered = data.filter((job) => {
            return (
                (!filters.jobType || job.jobType.toLowerCase().includes(filters.jobType.toLowerCase())) &&
                (!filters.salary || job.salary >= parseInt(filters.salary)) &&
                (!filters.title || job.title.toLowerCase().includes(filters.title.toLowerCase())) &&
                (!filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase()))
            );
        });
        setFilteredJobs(filtered);
    };

    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
    const paginatedJobs = filteredJobs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const applyNow = (id) => {
        console.log("🚀 ~ applyNow ~ id:", id)
        if (!token) {
            toast.error("Please Login to apply for a Job")
            return
        }
        if (userRole != "EMPLOYEE") {
            toast.error("only Employee can apply for a job")
            return
        }
        navigate(`/apply/${id}`)
    }

    return (
        <div className="min-h-screen pt-10 flex flex-col gap-10 items-center w-full">
            <div className="w-[97%] max-w-5xl">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            name="title"
                            placeholder="Search job titles, keywords"
                            value={filters.title}
                            onChange={handleFilterChange}
                            className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 shadow-sm"
                        />
                    </div>
                    <div className="flex-1 relative">
                        <FaLocationDot className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={filters.location}
                            onChange={handleFilterChange}
                            className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => filterJobs(filters)}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <FaSearch />
                        Search
                    </button>
                </div>

                {/* Additional Filters */}
                <div className="flex flex-wrap gap-4 pt-4">
                    <select
                        name="jobType"
                        value={filters.jobType}
                        onChange={handleFilterChange}
                        className="p-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Job Type</option>
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="CONTRACT">Contract</option>
                    </select>
                    {/* <div className="relative">
                        <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="number"
                            name="salary"
                            placeholder="Minimum Salary"
                            value={filters.salary}
                            onChange={handleFilterChange}
                            className="p-2 pl-10 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div> */}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center relative">
                    <div className="relative w-24 h-24">
                        <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-500 border-r-blue-700 rounded-full animate-spin"></div>
                    </div>
                    <div className="absolute">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="flex flex-col items-center">
                    <p className="text-xl font-semibold">
                        No job meet that criteria
                    </p>
                </div>
            ) : (
                <div className="w-full mt-10 flex flex-col md:flex-row gap-5">
                    <div
                        className={`
              ${isMobile && showDetail ? "hidden" : "flex"}
              flex-col gap-4 items-center ${!isMobile ? "md:w-4/12" : "w-full"}
            `}
                    >
                        {paginatedJobs.map((item) => (
                            <div
                                key={item.id}
                                id={`job-${item.id}`}
                                onClick={() => detail(item.id)}
                                className={`Card-item w-11/12 mb-4 cursor-pointer rounded-lg border border-blue-50 px-4 py-4 ${jobDetail && jobDetail.id === item.id
                                    ? "bg-slate-200"
                                    : "bg-slate-100"
                                    }`}
                            >
                                <div className="top flex justify-between">
                                    <p>
                                        {new Date(item.postedAt).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>
                                    <span className="bg-blue-500 px-2 py-1 capitalize rounded-full text-white text-sm">
                                        {item.jobType.split("_").join(" ").toLowerCase()}
                                    </span>
                                </div>
                                <h1 className="mt-3 text-xl font-semibold capitalize md:text-2xl md:font-bold text-start">
                                    {item.title}
                                </h1>
                                <div className="company mt-2 flex justify-between text-gray-700 capitalize">
                                    <span>{item.companyName}</span>
                                    <span>{item.location}</span>
                                </div>
                                <div className="pt-7 text-sm text-start capitalize whitespace-pre-wrap md:text-base">
                                    {item.description.length > 50
                                        ? `${item.description.slice(0, 50)}...`
                                        : item.description}
                                </div>
                                <div className="flex items-center justify-end pt-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            detail(item.id);
                                        }}
                                        className="rounded-full border-2 border-blue-500 bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-700 hover:border-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                    >
                                        Detail
                                    </button>
                                </div>
                            </div>
                        ))}
                        {totalPages > 1 && (
                            <div className="flex gap-2 mt-6">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    className={`px-3 py-1 rounded ${currentPage === 1
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                        }`}
                                >
                                    Prev
                                </button>
                                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                                    (page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 rounded ${currentPage === page
                                                ? "bg-blue-700 text-white"
                                                : "bg-blue-500 text-white hover:bg-blue-600"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    className={`px-3 py-1 rounded ${currentPage === totalPages
                                        ? "bg-gray-300 cursor-not-allowed"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>

                    <div
                        id="detail"
                        className={`
              ${isMobile ? (showDetail ? "block" : "hidden") : "flex"}
              flex-col rounded-lg bg-slate-100 py-7 px-7 ${!isMobile ? "md:w-[60%]" : "w-full"}
            `}
                    >
                        {isMobile && (
                            <button
                                onClick={() => setShowDetail(false)}
                                className="mb-4 text-start w-full text-blue-500 font-medium"
                            >
                                Go Back
                            </button>
                        )}
                        {jobDetail ? (
                            <div className="w-full">
                                <div className="top flex justify-end">
                                    <span className="bg-blue-500 px-3 py-2 capitalize rounded-full text-white text-sm flex items-center justify-center">
                                        {jobDetail.jobType.split("_").join(" ").toLowerCase()}
                                    </span>
                                </div>
                                <h1 className="mt-4 text-4xl font-extrabold text-start">
                                    {jobDetail.title}
                                </h1>
                                <h2 className="mt-1 ml-1 flex items-start gap-3 text-lg font-semibold capitalize">
                                    {jobDetail.companyName}
                                </h2>
                                <div className="mt-3 space-y-1 text-lg">
                                    <div className="flex items-center">
                                        <BsClock size={16} className="me-1" />
                                        <span className="font-semibold">Job Posted At:</span>
                                        <p className="ml-2">
                                            {new Date(jobDetail.postedAt).toLocaleDateString(undefined, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                                <FaLocationDot size={19} className="me-1" />

                                        <span className="font-semibold">Location:</span>
                                        <span className="ml-2">{jobDetail.location}</span>
                                    </div>
                                    <div className="flex items-center">
                                                <BiDollar size={21} className="me-1" />

                                        <span className="font-semibold">Salary:</span>
                                        <span className="ml-2">{jobDetail.salary}</span>
                                    </div>
                                    <div className="flex items-center">
                                                <BiUser size={20} className="me-1" />

                                        <span className="font-semibold">Total Applicants:</span>
                                        <span className="ml-2">{jobDetail.applications.length}</span>
                                    </div>
                                </div>
                                <p className="mt-4 whitespace-pre-wrap sm:text-lg capitalize text-start mb-4">
                                    {jobDetail.description}
                                </p>
                                <div className="flex pt-8 items-start">
                                    <img
                                        src="/compant.png"
                                        className="h-16 w-auto"
                                        alt="Company"
                                    />
                                    <div className="ml-4 pt-2 flex flex-col items-start">
                                        <h2 className="text-xl font-bold">
                                            {jobDetail.User.fullName}
                                        </h2>
                                        <p className="text-sm">{jobDetail.User.email}</p>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center justify-end">
                                    <button
                                        onClick={() => applyNow(jobDetail.id)}
                                        className="rounded-full cursor-pointer border-2 border-blue-500 bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-700 hover:border-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center w-full">
                                <p>Select a job to see details</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Job;