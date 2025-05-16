import mongoose, { Schema, Document }  from "mongoose";
import { isEmail, isURL } from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export interface IUser extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    firstName: string;
    lastName: string;
    emailId: string;
    password: string;
    age: number;
    gender: string;
    about: string;
    photoUrl: string;
    getJWT(): Promise<string>;
    isPasswordValid(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value: string) => isEmail(value),
            message: 'Invalid email address',
        },
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    about: {
        type: String,
        default: "Hey there! I am using DevTinder",
    },
    photoUrl: { 
        type: String,
        default: "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?semt=ais_hybrid&w=740",
        validate: {
            validator: (value: string) => {
                return isURL(value);
            },
            message: 'Invalid URL',
        },
    },
},
{timestamps: true},
);

userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({id: user._id}, "DevTinder@123",{expiresIn: "7d"});
    return token;
}

userSchema.methods.isPasswordValid = async function(inputPassword: string) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(inputPassword, user.password);
    return isPasswordValid;
}
const User = mongoose.model<IUser>('User', userSchema);
export default User;
