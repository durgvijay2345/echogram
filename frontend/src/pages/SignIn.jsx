import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (userName !== "") setInputClicked(prev => ({ ...prev, userName: true }));
    if (password !== "") setInputClicked(prev => ({ ...prev, password: true }));
  }, [userName, password]);

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
      dispatch(setUserData(userData));

      toast.success(userData.message || "Sign In Successful!");
      setLoading(false);
      navigate("/");
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4 py-8">
      <div className="w-full max-w-5xl h-auto bg-white/10 backdrop-blur-md rounded-3xl border border-gray-700 shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex flex-col lg:flex-row overflow-hidden transition-all duration-500">

        {/* Left Side Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center gap-6 p-6 sm:p-8">
          {/* Logo Title */}
          <div className="flex items-center text-xl sm:text-2xl font-semibold">
            <span className="text-2xl sm:text-3xl font-bold tracking-widest bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent">
              Sign In
            </span>
            <img src={logo1} alt="Echogram Logo" className="w-[100px] sm:w-[130px] ml-2" />
          </div>

          {/* Username Input */}
          <div className="relative w-[90%] h-[52px] flex-shrink-0 rounded-2xl border border-white/30 bg-white/10 focus-within:ring-2 ring-pink-500">
         <input
  type="text"
  id="username"
  name="username"
  autoComplete="username"
  placeholder="Enter Username"
  className="w-full h-full bg-gray-800/50 text-white px-4 pt-2 placeholder-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500"
  onFocus={() => setInputClicked(prev => ({ ...prev, userName: true }))}
  onChange={(e) => setUserName(e.target.value)}
  value={userName}
  required
/>

            <label
              htmlFor="username"
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/70 px-1 transition-all
                ${inputClicked.userName || userName ? "top-[-10px] text-xs bg-black/30" : ""}`}
            >
              Enter Username
            </label>
          </div>

          {/* Password Input */}
          <div className="relative w-[90%] h-[50px] flex-shrink-0 rounded-2xl border border-white/30 bg-white/10 focus-within:ring-2 ring-pink-500">
           <input
  type={showPassword ? "text" : "password"}
  id="password"
  name="password"
  autoComplete="current-password"
  placeholder="Enter Password"
  className="w-full h-full bg-gray-800/50 text-white px-4 pt-2 placeholder-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500"
  onFocus={() => setInputClicked(prev => ({ ...prev, password: true }))}
  onChange={(e) => setPassword(e.target.value)}
  value={password}
  required
/>

            <label
              htmlFor="password"
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/70 px-1 transition-all
                ${inputClicked.password || password ? "top-[-10px] text-xs bg-black/30" : ""}`}
            >
              Enter Password
            </label>
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

          {/* Forgot Password Link */}
          <Link to="/forgot-password" className="w-[90%] text-sm text-red-400 hover:underline text-right">
            Forgot Password?
          </Link>

          {/* Error Message */}
          {err && <p className="text-red-500 text-center">{err}</p>}

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-[70%] h-[48px] rounded-2xl bg-gradient-to-r from-pink-600 to-red-600 hover:scale-105 transition duration-300 text-white font-bold flex justify-center items-center"
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

        {/* Right Side Image & Slogan */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center gap-6 p-4 sm:p-6">
          <img
            src={logo2}
            alt="logo"
            className="w-[50%] sm:w-[60%] max-w-[250px] rounded-full shadow-lg border-4 border-pink-600 hover:scale-105 transition-transform duration-300"
          />
          <p className="text-xl sm:text-2xl font-bold italic uppercase text-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent tracking-wider">
            Your Vibe. Your Echo. Your Story.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;




