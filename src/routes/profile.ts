import express, {Request,Response} from 'express';
import { AuthRequest } from '../types/interface';
import userAuth from '../middleware/auth';
const profileRouter = express.Router();
import User, { IUser } from "../model/user";
import { validateEditProfileData } from '../utils/validation';

profileRouter.get("/profile/view", userAuth, (req: AuthRequest, res: Response) => {
    const user = req.user;
    res.send("user profile is "+user);
});

profileRouter.delete("/user", async(req: Request, res: Response) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted suceessfully")
    } catch(err){
        res.status(400).send("Something went wrong")
    }
});

profileRouter.get("/feed", async(req: Request, res: Response) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch(err){
        res.status(400).send("Somehthing went wrong...")
    }
});

profileRouter.patch("/profile/edit", userAuth, async(req: AuthRequest, res: Response) => {
    try {
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit request");
        }
        const loggedInUser = req.user;
        console.log("loggedInUser", loggedInUser);
        if (!loggedInUser) {
            throw new Error("User not found");
        }
        const updatableFields: (keyof IUser)[] = ["firstName", "lastName", "emailId", "gender", "age", "about", "photoUrl"]; 
        updatableFields.forEach((key) => {
            const value = req.body[key];
            if (value !== undefined) {
                (loggedInUser[key] as any) = req.body[key];
            }
        });
        await loggedInUser.save();
        res.status(200).json({
            message:"user updated successfully",
            user: loggedInUser
        });
    } catch(err:any){
        res.status(400).send("ERROR: "+err);
    }
})

export default profileRouter;