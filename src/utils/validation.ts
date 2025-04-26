import { Request } from "express";

export const validateEditProfileData = (req: Request) => {
    const allowedFields = ["firstName", "lastName", "emailId", "gender", "age", "about","photoUrl"];
    const isEditAllowed = Object.keys(req.body).every((key) => allowedFields.includes(key));
    return isEditAllowed;
}
