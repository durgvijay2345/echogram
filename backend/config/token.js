import jwt from "jsonwebtoken";

const genToken = async (userId, tokenVersion) => {
  try {
    const token = await jwt.sign(
      { userId, tokenVersion },  
      process.env.JWT_SECRET,
      {
        expiresIn: "10y", 
      }
    );
    return token;
  } catch (error) {
    console.error("Error generating token:", error.message);
    return null;
  }
};

export default genToken;

