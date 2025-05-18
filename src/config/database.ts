import mongoose from "mongoose";

const connectDB = async() => {
    await mongoose.connect(
        process.env.DB_CONNECTION_SECRET as string,
    );
}

export default connectDB;