import { FaSearch, FaUserPlus } from "react-icons/fa"
import { Link } from "react-router-dom"

function Home() {
    return (
        <div className='box-border min-h-screen'>
            <section
                id="hero"
                className="grid lg:grid-cols-2 place-items-center pb-8 px-5 lg:pl-16  md:pb-24 gap-8">
                <div>
                    <h1
                        className="text-5xl lg:text-6xl text-start font-bold 3xl:text-7xl  lg:tracking-tight xl:tracking-tighter">
                        Your Next
                        {" "}
                        <span className="block w-full py-2 text-transparent bg-clip-text leading-12 bg-blue-500 lg:inline">
                            Career Move
                        </span>
                        {" "}
                        Starts Here
                    </h1>
                    <p className="text-lg text-start mt-8 dark:text-slate-300 max-w-xl">
                        <span className="font-bold">EmiratiConnect:</span> Connect with leading employers in the UAE.
                        Apply to your dream jobs with ease, showcase your skills, and take the next step in your professional journey.
                        Let our smart matching system find the perfect opportunities for you.
                    </p>
                    <div className="pt-6 flex flex-col sm:flex-row items-center gap-3">
                        <Link
                            to="/register"
                            className="w-full">
                            <button className="w-full bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors">
                                <FaUserPlus className="text-white text-lg mr-2" />
                                Create Your Profile
                            </button>
                        </Link>

                        <Link
                            to="/jobs"
                            className="w-full">
                            <button className="w-full border border-gray-300 cursor-pointer hover:bg-gray-50 px-6 py-3 rounded-lg flex items-center justify-center transition-colors">
                                <FaSearch className="text-blue-500 text-lg mr-2" />
                                Explore Jobs
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="mt-24 lg:mt-0 md:order-1">
                    <img
                        src="/Job hunt.gif"
                        alt="job board hero image"
                        width={640}
                        height={480}
                        loading="eager"
                    />
                </div>
            </section>

            <section id="works" className="relative w-full flex items-center justify-center mb-20">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mx-auto text-center">
                        <h2 className="text-4xl text-black font-extrabold mx-auto md:text-6xl lg:text-5xl">Simple Application Process</h2>
                        <p className="max-w-2xl mx-auto mt-4 mb-20 text-base text-gray-700 leading-relaxed md:text-2xl">
                            Three easy steps to start your career journey
                        </p>
                    </div>
                    <div className="relative mt-12 lg:mt-20">
                        <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
                            <img alt="process flow" loading="lazy" width="1000" height="500" decoding="async" data-nimg="1" className="w-full" src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg" />
                        </div>
                        <div className="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12">
                            <div className="flex items-center justify-center flex-col">
                                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-600 rounded-full shadow">
                                    <span className="text-xl font-semibold text-gray-700">1</span>
                                </div>
                                <h3 className="mt-6 text-xl text-black font-semibold leading-tight md:mt-10">Build Your Profile</h3>
                                <p className="mt-4 text-base text-gray-600 md:text-lg">
                                    Create your professional profile and upload your CV
                                </p>
                            </div>
                            <div className="flex items-center justify-center flex-col">
                                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-600 rounded-full shadow">
                                    <span className="text-xl font-semibold text-gray-700">2</span>
                                </div>
                                <h3 className="mt-6 text-xl text-black font-semibold leading-tight md:mt-10">Find Matching Jobs</h3>
                                <p className="mt-4 text-base text-gray-600 md:text-lg">
                                    Browse jobs that match your skills and experience
                                </p>
                            </div>
                            <div className="flex items-center justify-center flex-col">
                                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-600 rounded-full shadow">
                                    <span className="text-xl font-semibold text-gray-700">3</span>
                                </div>
                                <h3 className="mt-6 text-xl text-black font-semibold leading-tight md:mt-10">Apply With One Click</h3>
                                <p className="mt-4 text-base text-gray-600 md:text-lg">
                                    Submit your application instantly to your chosen positions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="px-12 mx-auto w-full flex items-center justify-center">
                <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center">
                    <h1 className="mb-8 w-full text-3xl sm:text-4xl font-extrabold leading-none tracking-normal text-gray-900 md:text-6xl md:tracking-tight">
                        <span>Launch Your</span> <span className="block w-full py-2 text-transparent bg-clip-text leading-12 bg-blue-500 lg:inline">Career</span> <span>Today</span>
                    </h1>
                    <p className="px-0 mb-8 text-lg text-gray-600 md:text-xl lg:px-24">
                        Join thousands of successful professionals who found their dream jobs through EmiratiConnect.
                        Our platform connects you with top employers in the UAE and makes the application process seamless.
                    </p>
                    <div className="mb-4 space-x-0 md:space-x-2 md:mb-8">
                        <Link to="/register" className="inline-flex items-center justify-center w-full px-6 py-3 mb-2 text-lg text-white bg-blue-500 hover:bg-blue-600 rounded-2xl sm:w-auto sm:mb-0 transition-colors">
                            Start Your Journey
                            <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="py-24">
                <img
                    src="/pexels-kindelmedia-7688336.jpg"
                    alt="professional workplace"
                    className="px-3 lg:px-10 h-[400px] w-full rounded-2xl overflow-hidden object-cover"
                    loading="eager"
                />
            </div>

            <section className="relative z-10 overflow-hidden bg-blue-500 py-16 mb-20 px-8">
                <div className="container">
                    <div className="-mx-4 flex flex-wrap items-center">
                        <div className="w-full px-4 lg:w-1/2">
                            <div className="text-center lg:text-left">
                                <div className="mb-10 lg:mb-0">
                                    <h1 className="mt-0 mb-3 text-3xl font-bold leading-tight sm:text-4xl sm:leading-tight md:text-[40px] md:leading-tight text-white">
                                        Ready to Apply? Create Your Profile Now
                                    </h1>
                                </div>
                            </div>
                        </div>
                        <div className="w-full px-4 lg:w-1/2">
                            <div className="text-center lg:text-right">
                                <Link to="/register" className="font-semibold rounded-lg mx-auto inline-flex items-center justify-center bg-white py-4 px-9 hover:bg-opacity-90">
                                    Create Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <span className="absolute top-0 right-0 -z-10">
                    <svg width={388} height={250} viewBox="0 0 388 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.05" d="M203 -28.5L4.87819e-05 250.5L881.5 250.5L881.5 -28.5002L203 -28.5Z" fill="url(#paint0_linear_971_6910)" />
                        <defs>
                            <linearGradient id="paint0_linear_971_6910" x1="60.5" y1={111} x2={287} y2={111} gradientUnits="userSpaceOnUse">
                                <stop offset="0.520507" stopColor="white" />
                                <stop offset={1} stopColor="white" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                    </svg>
                </span>
            </section>
            <div className="text-gray-600  py-8 pb-16 " id="reviews">

                <div className=" mx-auto px-6 md:px-12 xl:px-6">

                    <div className="mb-10 space-y-4 px-6 md:px-0 flex w-full justify-center">
                        <h2 className="text-center text-2xl w-full md:w-2/4 font-bold text-gray-800 md:text-4xl">
                            We have some Fans around the World.
                        </h2>
                    </div>


                    <div className="md:columns-2 lg:columns-3 gap-8 space-y-8">


                        <div
                            className="aspect-auto p-8 border border-gray-100 rounded-3xl bg-white shadow-2xl shadow-gray-600/10 ">
                            <div className="flex gap-4">
                                <div>
                                    <h6 className="text-lg font-medium text-gray-700">Daniella Doe</h6>
                                    <p className="text-sm text-gray-500 ">Project Manager</p>
                                </div>
                            </div>
                            <p className="mt-8">Emirati connect has been an absolute game-changer for me. As someone who was feeling overwhelmed by the job search process, I can not emphasize enough how much this platform simplified everything. The user interface is intuitive, making it incredibly easy to navigate through the plethora of job listings. I found my dream job within days of signing up, and I truly believe it was all thanks to Emirati connect efficient search algorithm.
                            </p>
                        </div>


                        <div
                            className="aspect-auto p-8 border border-gray-100 rounded-3xl bg-whiteshadow-2xl shadow-gray-600/10 ">
                            <div className="flex gap-4">
                                <div>
                                    <h6 className="text-lg font-medium text-gray-700 ">Jane doe</h6>
                                    <p className="text-sm text-gray-500 ">Marketing</p>
                                </div>
                            </div>
                            <p className="mt-8">Within a week of using Emirati connect, I landed a job that perfectly matched my skills and career goals. I was impressed by the wide range of job listings available on the platform
                            </p>
                        </div>


                        <div
                            className="aspect-auto p-8 border border-gray-100 rounded-3xl bg-white shadow-2xl shadow-gray-600/10">
                            <div className="flex gap-4">
                                <div>
                                    <h6 className="text-lg font-medium text-gray-700 ">Yanick Doe</h6>
                                    <p className="text-sm text-gray-500 ">Developer</p>
                                </div>
                            </div>
                            <p className="mt-8">I was impressed by the wide range of job listings available on the platform, covering various industries and positions. The filters were particularly useful; I could easily narrow down my search based on location, industry, and job type. Emirati connect made the entire job hunting process a breeze, and I am grateful for the opportunity it provided me.
                            </p>
                        </div>


                        <div
                            className="aspect-auto p-8 border border-gray-100 rounded-3xl bg-white shadow-2xl shadow-gray-600/10 ">
                            <div className="flex gap-4">
                                <div>
                                    <h6 className="text-lg font-medium text-gray-700">Jane Doe</h6>
                                    <p className="text-sm text-gray-500 ">Mobile dev</p>
                                </div>
                            </div>
                            <p className="mt-8">Emirati connect exceeded my expectations in every way possible. Not only did it help me secure multiple interviews within a matter of weeks, but it also provided me with invaluable resources and support throughout the job search journey.
                            </p>
                        </div>


                        <div
                            className="aspect-auto p-8 border border-gray-100 rounded-3xl bg-white shadow-2xl shadow-gray-600/10 ">
                            <div className="flex gap-4">
                                <div>
                                    <h6 className="text-lg font-medium text-gray-700">Andy Doe</h6>
                                    <p className="text-sm text-gray-500 ">Manager</p>
                                </div>
                            </div>
                            <p className="mt-8"> As a recent graduate entering the job market, I was met with uncertainty and apprehension. However, Emirati connect quickly alleviated my concerns and provided me with the confidence I needed to navigate the job search process successfully.
                            </p>
                        </div>


                        <div
                            className="aspect-auto p-8 border border-gray-100 rounded-3xl bg-white shadow-2xl shadow-gray-600/10">
                            <div className="flex gap-4">
                                <div>
                                    <h6 className="text-lg font-medium text-gray-700">Yanndy Doe</h6>
                                    <p className="text-sm text-gray-500">Mobile dev</p>
                                </div>
                            </div>
                            <p className="mt-8">Emirati connect has simplified the job hunting process in ways I never thought possible. What I love most about the platform is its simplicity and effectiveness. Unlike other job search websites that overwhelm you with endless options, Emirati connect provides a curated selection of job listings tailored to your preferences.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home