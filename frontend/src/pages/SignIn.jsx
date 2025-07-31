import React, { useState } from 'react';
import axios from 'axios';
import logo1 from "../assets/echo1.png";
import logo2 from "../assets/echo2.png";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useNavigate, Link } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { serverUrl } from '../App';

function SignIn() {
  const [inputClicked, setInputClicked] = useState({
    userName: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    setLoading(true);
    setErr("");

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { userName, password },
        { withCredentials: true }
      );

      const userData = result.data;
      console.log("SignIn API Response:", userData);

      // Store token and userData in localStorage
      localStorage.setItem("token", userData.token);
      localStorage.setItem("userData", JSON.stringify(userData));

      // Update Redux store
      dispatch(setUserData(userData));

      toast.success(userData.message || "Sign In Successful!");
      setLoading(false);
      navigate("/"); // Go to Home Page
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl border border-gray-700 shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex flex-col lg:flex-row overflow-hidden transition-all duration-500">

        {/* Left Form Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8 gap-6">

          {/* Title */}
          <div className="flex items-center text-xl sm:text-2xl font-semibold">
            <span className="text-2xl sm:text-3xl font-bold tracking-widest bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent animate-text-glow shadow-lg drop-shadow-[0_2px_10px_rgba(255,100,100,0.4)]">
              Sign In
            </span>
            <img src={logo1} alt="Echogram Logo" className="w-[100px] sm:w-[130px] h-auto object-contain ml-2" />
          </div>

          {/* Username Input */}
          <div className="relative w-[90%] h-[50px] rounded-2xl border border-white/30 bg-white/5 focus-within:ring-2 ring-pink-500">
            <label htmlFor="username" className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white px-1 transition-all ${inputClicked.userName || userName ? "top-[-10px] text-xs" : ""}`}>
              Enter Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              autoComplete="username"
              className="w-full h-full bg-transparent text-white px-4 pt-2 outline-none rounded-2xl"
              onClick={() => setInputClicked({ ...inputClicked, userName: true })}
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative w-[90%] h-[50px] rounded-2xl border border-white/30 bg-white/5 focus-within:ring-2 ring-pink-500">
            <label htmlFor="password" className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white px-1 transition-all ${inputClicked.password || password ? "top-[-10px] text-xs" : ""}`}>
              Enter Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="current-password"
              className="w-full h-full bg-transparent text-white px-4 pt-2 outline-none rounded-2xl"
              onClick={() => setInputClicked({ ...inputClicked, password: true })}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            {showPassword ? (
              <IoIosEyeOff
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <IoIosEye
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

        
          <Link
            to="/forgot-password"
            className="w-[90%] text-sm text-red-400 hover:underline text-right"
          >
            Forgot Password?
          </Link>

         
          {err && <p className="text-red-500 text-center">{err}</p>}

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-[70%] h-[48px] rounded-2xl bg-gradient-to-r from-pink-600 to-red-600 hover:scale-105 transition transform duration-300 text-white font-bold shadow-md"
          >
            {loading ? <ClipLoader size={25} color="white" /> : "Sign In"}
          </button>

          {/* Switch to Sign Up */}
          <p className="text-sm text-gray-200">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-400 underline cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </div>

       
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center gap-6 p-4 sm:p-6">
          <img
            src={logo2}
            alt="logo"
            className="w-[60%] max-w-[200px] sm:max-w-[250px] rounded-full shadow-lg border-4 border-pink-600 hover:scale-105 transition-transform duration-300"
          />
          <p className="text-xl sm:text-2xl font-bold italic uppercase text-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent tracking-wider drop-shadow-[2px_2px_5px_rgba(255,255,255,0.3)]">
            Your Vibe. Your Echo. Your Story.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;

