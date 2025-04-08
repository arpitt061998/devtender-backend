import express, { NextFunction, Request, Response } from 'express';
import User from './model/user';
import connectDB from './config/database';
const app = express();
const port = 3000;

// Define a simple route

app.post("/signup", async(req: Request, res: Response) => {
    const userObj = {
        firstName: "Virat",
        lastName: "Kohli",
        emailId: "viratkohli.in@gmail.com",
        password: "virat123",
        age: 36,
        gender: "Male"
    };
    const user = new User(userObj);
    try {
        await user.save();
        res.send("user added successfully")
    } catch(err){
        res.status(400).send("Error saving user")
    }
});

connectDB().then(() => {
    console.log("databse connection established");
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}).catch((err: Error )=> {
    console.error("database cannot be connected");
})

 