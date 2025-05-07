import express, {Request, Response} from "express";
import { AuthRequest } from "../types/interface";
import ConnectionRequest from "../model/connectionRequest";
import userAuth from "../middleware/auth";
const userRouter = express.Router();
import { IUser } from "../model/user";

const USER_SAFE_DATA = ["firstName", "lastName", "age", "skills", "gender", "photoUrl"];
userRouter.get("/user/requests/pending", userAuth, async (req: AuthRequest, res: Response) => {
    try {
        const loggedInUser = req.user;
        const userId = loggedInUser?._id;
        const firstName = loggedInUser?.firstName;

        if (!userId) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }

        const connections = await ConnectionRequest.find({ 
            toUserId: userId,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);

        if (connections.length === 0) {
            res.status(404).json({ message: "No connections found" });
            return;
        }

        res.status(200).json({
            message: `${firstName}'s connections`,
            connections: connections
        });

    } catch (err: any) {
        res.status(500).json({ message: "Internal server error "+ err.message });
    }
});

userRouter.get("/user/connections", userAuth, async(req: AuthRequest, res: Response) => {
    try {
        const loggedInUser = req.user;
        const userId = loggedInUser?._id!;

        const connections = await ConnectionRequest.find({
            $or: [   
                {toUserId: userId, status: "accepted"},
                {fromUserId: userId, status: "accepted"}
            ]
        })
        .populate<{ fromUserId: IUser; toUserId: IUser }>("fromUserId", USER_SAFE_DATA)
        .populate<{ fromUserId: IUser; toUserId: IUser }>("toUserId", USER_SAFE_DATA);

        const data = connections.map((connection) => {
        
            if (connection.fromUserId._id.toString() === loggedInUser?._id.toString()) {
                return connection.toUserId;
            } else {
                return connection.fromUserId;
            }
        });

        res.status(200).json({
            message: loggedInUser?.firstName + " connections are: ",
            connections: data
        });
    } catch(err: any) {
        res.status(500).json({ message: "Internal server error "+ err.message });
    }
});

export default userRouter;

