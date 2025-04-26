import express, {Request, Response} from "express";
import User from "../model/user";
import bcrypt from "bcrypt";
const authRouter = express.Router();
const SALT_ROUNDS = 10;

authRouter.post("/signup", async(req: Request, res: Response) => {
    const {firstName, lastName, emailId, password, gender, age} = req.body;
    const user = new User(req.body);
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    console.log(hashedPassword);
    try {
        const user = new User({
            firstName, lastName, emailId, password: hashedPassword, gender, age 
        })
        await user.save();
        res.status(200).send("user added successfully")
    } catch(err: any){
        res.status(400).send(err.message)
    }
});

authRouter.post("/login",async(req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({emailId: email});
        if(!user){
            throw new Error("user not found")
        }
        const isPasswordValid = await user.isPasswordValid(password);
        if(isPasswordValid){
            const token = await user.getJWT();
            res.cookie("token", token);
            res.status(200).send("Login successful");
        } else {
            res.status(401).send("Invalid password");
        }
    } catch(err:any){
        res.status(401).send("Err: "+err);
    }
});

authRouter.post("/logout", async(req: Request, res: Response) => {
    try {
        res.clearCookie("token");
        res.status(200).send("Logout successful");
    } catch(err:any){
        res.status(401).send("Err: "+err);
    }
});


export default authRouter;