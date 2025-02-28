
import { Link, useLocation } from 'react-router-dom';

function Footer() {
    const location = useLocation();
    const path = location.pathname;
    if (path.startsWith("/profile")) {
        return
    }
        return (
            <footer className="flex items-center justify-center bg-blue-600 backdrop-blur-md py-10 px-10 font-sans tracking-wide">
                <div className="max-w-screen-xl w-full ">
                    <div className="flex flex-wrap items-center md:justify-between max-md:flex-col gap-6">
                        <div>
                            <Link to="/"><img src="/logo.png" alt="logo" className=" h-24" /></Link>
                        </div>

                        <ul className="flex items-center justify-center flex-wrap gap-y-2 md:justify-end space-x-6">
                            <li><Link to="/" className="text-white hover:underline text-base">Home</Link></li>
                            <li><Link to="/jobs" className="text-white hover:underline text-base">Explore Jobs</Link></li>
                            <li><Link to="/register" className="text-white hover:underline text-base">Create Account</Link></li>
                            <li><Link to="/login" className="text-white hover:underline text-base">Login</Link></li>
                        </ul>
                    </div>

                    <hr className="my-6 border-white" />

                    <p className="text-center text-white text-base">© EmiratiConnect. All rights reserved.</p>
                </div>
            </footer>
        )
}

export default Footer
