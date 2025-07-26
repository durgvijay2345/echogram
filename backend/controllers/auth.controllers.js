import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import sendMail from "../config/Mail.js"

export const signUp = async (req, res) => {
  try {
    const { name, email, password, userName } = req.body;

    // Check for existing email
    const findByEmail = await User.findOne({ email });
    if (findByEmail) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Check for existing username
    const findByUserName = await User.findOne({ userName });
    if (findByUserName) {
      return res.status(400).json({ message: "Username already exists!" });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      userName,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = await genToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years
      secure: false, // Set to true in production with HTTPS
      sameSite: "Strict",
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Signup error: ${error.message}` });
  }
};

export const signIn = async (req, res) => {
  try {
    const { password, userName } = req.body;

    // Find user by username
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    // Generate token
    const token = await genToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "Strict",
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `SignIn error: ${error.message}` });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Sign out successful" });
  } catch (error) {
    return res.status(500).json({ message: "Sign out error" });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    user.isOtpVerified = false;

    await user.save();

    await sendMail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    return res.status(200).json({ message: "Email sent successfully" });

  } catch (error) {
    return res.status(500).json({ message: `Send OTP error: ${error}` });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    otp = otp?.toString().trim(); // Normalize OTP input

    const user = await User.findOne({ email });

    if (
      !user ||
      !user.resetOtp || 
      user.resetOtp.toString().trim() !== otp ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Verify OTP error: ${error}` });
  }
};


export const resetPassword=async (req,res)=>{
    try {
        const {email,password}=req.body
        const user =await User.findOne({email})
        if(!user || !user.isOtpVerified){
            return res.status(400).json({message:"otp verfication required"})
        }

        const hashedPassword=await bcrypt.hash(password,10)
        user.password=hashedPassword
        user.isOtpVerified=false
await user.save()

return res.status(200).json({message:"password reset successfully"})

    } catch (error) {
         return res.status(500).json({message:`reset otp error ${error}`})
    }
}

