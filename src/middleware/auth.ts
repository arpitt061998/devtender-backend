import { NextFunction, Response, Request, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../model/user";
import {AuthRequest} from "../types/interface";

const userAuth: RequestHandler = async(req: AuthRequest, res: Response, next: NextFunction) => {
    const {token} = req.cookies;
    try {
        if(!token){
            res.status(401).json({ message: "Please login" });
            return;
        }
        const decodedMessage = jwt.verify(token, process.env.JWT_SECRET as string);
        const {id} = decodedMessage as JwtPayload; 
        const user = await User.findById(id);
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