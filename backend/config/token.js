import jwt from "jsonwebtoken";




const genToken = async (userId) => {
  try {
    const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "10y",
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error.message);
    return null; // or throw error if you want to handle it at caller level
  }
};

export default genToken;
