import { NextFunction, Response, Request, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../model/user";
import {AuthRequest} from "../types/interface";

const userAuth: RequestHandler = async(req: AuthRequest, res: Response, next: NextFunction) => {
    const {token} = req.cookies;
    try {
        if(!token){
            throw new Error("Token not valid");
        }
        const decodedMessage = jwt.verify(token, "DevTinder@123");
        console.log(decodedMessage);
        const {id} = decodedMessage as JwtPayload; 
        const user = await User.findById(id);
        console.log("user",user);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        req.user = user; // Attach the user to the request object
        next();
    } catch(err: any) {
        res.status(404).send("Authentication failed");
    }
};

export default userAuth;