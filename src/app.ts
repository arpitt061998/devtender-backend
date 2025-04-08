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

connectDB().then(() => {
    console.log("databse connection established");
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}).catch((err: Error )=> {
    console.error("database cannot be connected");
})

 