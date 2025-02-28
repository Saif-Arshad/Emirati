import './App.css'
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Home from './Components/Home/Home';
import Header from './Components/shared/Header';
import Footer from './Components/shared/Footer';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Profile from './Components/Profile/Index';
import MyVacancies from './Components/my-vacancie/My-vacancie';
import Job from './Components/Job/Job';
import Apply from './Components/Apply';
import MyApplications from './Components/My-applications';
import JobApplicant from './Components/JobApplicant';
import Verify from './Components/Verify';
import { useState, useEffect } from 'react';
import Users from './Components/Users';

function App() {
  const [isProfile, setIsprofile] = useState(false)
  const location = useLocation();

  useEffect(() => {
    setIsprofile(location.pathname.startsWith("/profile"))
  }, [location.pathname]);

  return (
    <>
      <Header />
      <div className='flex items-center justify-center'>
        <div className={`${isProfile ? " " : "max-w-[1600px]"}  w-full`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/jobs" element={<Job />} />
            <Route path="/profile/my-vacancie" element={<MyVacancies />} />
            <Route path="/profile/my-vacancie/:id" element={<JobApplicant />} />
            <Route path="/profile/my-applications" element={<MyApplications />} />
            <Route path="/profile/users" element={<Users />} />
            <Route path="/apply/:id" element={<Apply />} />
          </Routes>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  )
}

export default App
