import mongoose, { Schema, Document }  from "mongoose";
import { isEmail, isURL } from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export interface IUser extends Document {
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
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngitem.com%2Fmiddle%2Fhbomhxw_transparent-default-avatar-png-default-avatar-images-png%2F&psig=AOvVaw1FX9l0qS5efaiuU3rkT2HJ&ust=1745408999928000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPjw27PJ64wDFQAAAAAdAAAAABAJ",
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
