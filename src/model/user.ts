import mongoose, { Schema, Document }  from "mongoose";
import { isEmail } from "validator";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    emailId: string;
    password: string;
    age: number;
    gender: string;
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
},
{timestamps: true}
);

const User = mongoose.model<IUser>('User', userSchema);
export default User;
