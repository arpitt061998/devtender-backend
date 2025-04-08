import mongoose, { Schema, Document }  from "mongoose";

interface IUser extends Document {
    firstName: string;
    lastName: string;
    emailId: string;
    password: string;
    age: number;
    gender: string;
}

const userSchema = new Schema<IUser>({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    }
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;



