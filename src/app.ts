import express, { NextFunction, Request, Response } from 'express';
import User from './model/user';
import connectDB from './config/database';
const app = express();
const port = 3000;


app.use(express.json());
app.post("/signup", async(req: Request, res: Response) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send("user added successfully")
    } catch(err){
        res.status(400).send("Error saving user")
    }
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
