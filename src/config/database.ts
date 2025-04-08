import mongoose from "mongoose";

const connectDB = async() => {
    await mongoose.connect(
        "mongodb+srv://arpittiwari:DMrUfpyv5ypQT8pz@devtinder-be.dcxhmkr.mongodb.net/devTinder"
    );
}

export default connectDB;