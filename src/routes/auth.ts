import express, {Request, Response} from "express";
import User from "../model/user";
import bcrypt from "bcrypt";
import {run as sendEmail} from "../utils/sendEmail";
const authRouter = express.Router();
const SALT_ROUNDS = 10;
const SENDER_MAIL_ID = "no-reply@developerstinder.in";

const USER_SAFE_DATA = ["firstName", "lastName", "age", "skills", "gender", "photoUrl", "about"];

authRouter.post("/signup", async(req: Request, res: Response) => {
    const {firstName, lastName, emailId, password, gender, age, photoUrl, about} = req.body;
    const user = new User(req.body);
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    try {
        const user = new User({
            firstName, lastName, emailId, password: hashedPassword, gender, age, photoUrl, about
        })
        await user.save();
        await sendEmail(emailId, SENDER_MAIL_ID ,"Welcome to DevTinder", "You have successfully signed up");
        res.status(200).send("user added successfully")
    } catch(err: any){
        if (err.code === 11000 && err.keyPattern?.emailId) {
            res.status(400).json({ error: "Duplicate email error", message: "Email ID already exists" });
        } else {
            console.log(err.message);
            res.status(400).send(err.message);
        }
    }
});

authRouter.post("/login", async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: { $regex: `^${emailId}$`, $options: "i" } }); // Case-insensitive search
        if (!user) {
            res.status(404).json({ error: "user does not exist", message: "Email not found" });
            return;
        }
        const isPasswordValid = await user.isPasswordValid(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token);
            res.status(200).json({
                message: "Login successful",
                data: user,
            });
        } else {
            res.status(401).json({ error: "Invalid Password", message: "Invalid password" });
        }
    } catch (err: any) {
        res.status(500).send("Err: " + err);
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