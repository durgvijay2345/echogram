import mongoose from "mongoose"

const connectDB=async()=>{

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB connnected")
    } catch (error) {
        console.log("db error")
    }
}
export default connectDB