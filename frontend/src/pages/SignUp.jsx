import React, { useState } from 'react';
import axios from 'axios';
import logo1 from "../assets/echo1.png";
import logo2 from "../assets/echo2.png";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { serverUrl } from '../App';
function SignUp() {
  const [inputClicked, setInputClicked] = useState({
    name: false,
    userName: false,
    email: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const dispatch=useDispatch();

  const handleSignUp = async () => {
    setLoading(true);
    setErr("");

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, userName, email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data))
      localStorage.setItem("userData", JSON.stringify(result.data)); 
   toast.success(result.data.message || "user Sign up succesfull")
      setLoading(false);
      // Optional: Redirect after signup
      navigate("/signin");
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
  <div className="w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 flex justify-center items-center px-4 py-8">
    <div className="w-full max-w-6xl bg-white/10 backdrop-blur-md rounded-3xl border border-gray-700 shadow-[0_8px_30px_rgb(0,0,0,0.6)] flex flex-col lg:flex-row overflow-hidden transition-all duration-500">

      {/* Left Side (Form) */}
      <div className="w-full lg:w-1/2 bg-white/20 text-white flex flex-col items-center justify-center p-8 gap-6">
        
        {/* Top Logo Line */}
        <div className="flex items-center  text-[22px] font-semibold">
         <span className="text-3xl font-bold  tracking-widest bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent animate-text-glow shadow-lg drop-shadow-[0_2px_10px_rgba(255,100,100,0.4)]">
  Sign up 
</span>

          <img src={logo1} alt="Echogram Logo" className="w-[130px] h-auto max-h-[100px] object-contain bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent tracking-wider drop-shadow-[2px_2px_5px_rgba(255,255,255,0.3)]" />
        </div>

        {/* Name Field */}
        <div className="relative w-[90%] h-[52px] rounded-2xl border border-white/40 bg-white/5 focus-within:ring-2 ring-pink-400">
          <label htmlFor="name" className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white px-1 transition-all ${inputClicked.name || name ? "top-[-10px] text-xs bg-transparent" : ""}`}>
            Enter Your Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full h-full bg-transparent text-white px-4 pt-2 outline-none rounded-2xl"
            onClick={() => setInputClicked({ ...inputClicked, name: true })}
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>

        {/* Username Field */}
        <div className="relative w-[90%] h-[52px] rounded-2xl border border-white/40 bg-white/5 focus-within:ring-2 ring-pink-400">
          <label htmlFor="username" className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white px-1 transition-all ${inputClicked.userName || userName ? "top-[-10px] text-xs bg-transparent" : ""}`}>
            Enter Username
          </label>
          <input
            id="username"
            type="text"
            className="w-full h-full bg-transparent text-white px-4 pt-2 outline-none rounded-2xl"
            onClick={() => setInputClicked({ ...inputClicked, userName: true })}
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
          />
        </div>

        {/* Email Field */}
        <div className="relative w-[90%] h-[52px] rounded-2xl border border-white/40 bg-white/5 focus-within:ring-2 ring-pink-400">
          <label htmlFor="email" className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white px-1 transition-all ${inputClicked.email || email ? "top-[-10px] text-xs bg-transparent" : ""}`}>
            Enter Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full h-full bg-transparent text-white px-4 pt-2 outline-none rounded-2xl"
            onClick={() => setInputClicked({ ...inputClicked, email: true })}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        {/* Password Field */}
        <div className="relative w-[90%] h-[52px] rounded-2xl border border-white/40 bg-white/5 focus-within:ring-2 ring-pink-400">
          <label htmlFor="password" className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white px-1 transition-all ${inputClicked.password || password ? "top-[-10px] text-xs bg-transparent" : ""}`}>
            Enter Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="w-full h-full bg-transparent text-white px-4 pt-2 outline-none rounded-2xl"
            onClick={() => setInputClicked({ ...inputClicked, password: true })}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {
            showPassword
              ? <IoIosEyeOff className="absolute right-4 top-[50%] translate-y-[-50%] text-white cursor-pointer" onClick={() => setShowPassword(false)} />
              : <IoIosEye className="absolute right-4 top-[50%] translate-y-[-50%] text-white cursor-pointer" onClick={() => setShowPassword(true)} />
          }
        </div>

        {/* Error Message */}
        {err && <p className="text-red-400">{err}</p>}

        {/* Sign Up Button */}
        <button
          onClick={handleSignUp}
          disabled={loading}
          className="mt-2 w-[70%] h-[48px] rounded-2xl bg-gradient-to-r from-pink-600 to-red-600 hover:scale-105 transition transform duration-300 text-white font-bold shadow-lg"
        >
          {loading ? <ClipLoader size={25} color='white' /> : "Sign Up"}
        </button>

        {/* Redirect to Sign In */}
        <p className="text-gray-300 text-sm mt-2">
          Already have an account?{" "}
          <span onClick={() => navigate("/signin")} className="text-pink-400 underline cursor-pointer">
            Sign In
          </span>
        </p>
      </div>

      {/* Right Side (Logo + Slogan) */}
      <div className="w-full lg:w-1/2 bg-black text-white flex flex-col items-center justify-center gap-6 p-6">
        <img
          src={logo2}
          alt="logo"
          className="w-[60%] max-w-[250px] rounded-full shadow-lg border-4 border-pink-600 hover:scale-105 transition-transform duration-300"
        />
        <p className="text-3xl font-bold italic uppercase text-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent tracking-wider drop-shadow-[2px_2px_5px_rgba(255,255,255,0.3)]">
          Your Vibe. Your Echo. Your Story.
        </p>
      </div>
    </div>
  </div>
);

}

export default SignUp;
