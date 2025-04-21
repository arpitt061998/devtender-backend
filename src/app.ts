import express, { NextFunction, Request, Response } from 'express';
import bcrypt from "bcrypt";
import cookieParser from 'cookie-parser';
import User, {IUser} from './model/user';
import connectDB from './config/database';
import jwt, { JwtPayload } from 'jsonwebtoken';
import userAuth from './middleware/auth';
// import "./types/express"; // Ensure this import remains for type augmentation
import { AuthRequest } from './types/interface';
const app = express();
const port = 3000;
const SALT_ROUNDS = 10;

app.use(express.json());
app.use(cookieParser());
app.post("/signup", async(req: Request, res: Response) => {
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

app.post("/login",async(req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({emailId: email});
        if(!user){
            throw new Error("user not found")
        }
        const isPasswordValid = await bcrypt.compare(password,user.password)
        if(isPasswordValid){
            const token = jwt.sign({id: user._id}, "DevTinder@123");
            console.log(token);
            res.cookie("token", token);
            res.status(200).send("Login successful");
        } else {
            res.status(401).send("Invalid password");
        }
    } catch(err:any){
        res.status(401).send("Err: "+err);
    }
});

app.get("/profile", userAuth, (req: AuthRequest, res: Response) => {
    const user = req.user;
    res.send("user profile is "+user);
});

app.get("/user", async(req: Request, res: Response) => {
    const emailId = req.body.emailId;
    try {
        const user = await User.find({emailId: emailId});
        if(user.length === 0) {
            res.send("user not found");   
        } else {
            res.send(user);   
        }
    } catch(err) {
        res.status(400).send("Something went wrong...")
    }
});

app.delete("/user", async(req: Request, res: Response) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("user deleted suceessfully")
    } catch(err){
        res.status(400).send("Something went wrong")
    }
})

app.get("/feed", async(req: Request, res: Response) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch(err){
        res.status(400).send("Somehthing went wrong...")
    }
})

app.patch("/user", async(req: Request, res: Response) => {
    const {userId} = req.body;
    const data = req.body;
    try {
        const users = await User.findByIdAndUpdate({_id: userId}, data);
        res.send(users);
        console.log("User updated successfully");
    } catch(err){
        res.status(400).send("Somehthing went wrong...")
    }
})

connectDB().then(() => {
    console.log("databse connection established");
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}).catch((err: Error )=> {
    console.error("database cannot be connected");
})
