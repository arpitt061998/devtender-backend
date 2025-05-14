import express, {Request, Response} from "express";
import { AuthRequest } from "../types/interface";
import ConnectionRequest from "../model/connectionRequest";
import userAuth from "../middleware/auth";
const userRouter = express.Router();
import User, { IUser } from "../model/user";

const USER_SAFE_DATA = ["firstName", "lastName", "age", "skills", "gender", "photoUrl", "about"];
userRouter.get("/user/requests", userAuth, async (req: AuthRequest, res: Response) => {
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
            data: connections
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
            data: data
        });
    } catch(err: any) {
        res.status(500).json({ message: "Internal server error "+ err.message });
    }
});

userRouter.get("/user/feed",userAuth, async(req: AuthRequest, res: Response) => {
    try{
        const loggedInUser = req.user;
        const userId = loggedInUser?._id;
        const page = parseInt(req.query.page as string || "1");
        let limit = parseInt(req.query.limit as string || "10");

        limit = limit > 50 ? 50 : limit;
        const skip = (page-1)*limit;

        // User should see all the user card expect-
        // his own card
        // ignored people
        // already sent connection request

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: userId},
                {toUserId: userId}
            ]
        }).select("fromUserId toUserId");

        const hideUserIds = new Set<string>();

        connectionRequests.forEach((connection) => {
            hideUserIds.add(connection.fromUserId.toString());
            hideUserIds.add(connection.toUserId.toString());
        })

        const feedUsers = await User.find({
            _id: {$nin: Array.from(hideUserIds)}
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.status(200).send({
            message: "Feeds are: ",
            feed: feedUsers
        });
    } catch(err:any) {
        res.status(400).send("Error: "+err)
    }
});

//api to list all users present expect loggedinuser ~ just for fun
userRouter.get("/user/all", userAuth, async(req: AuthRequest, res: Response) => {
    try {
        const loggedInUser = req.user;
        const userId = loggedInUser?._id;
        const page = parseInt(req.query.page as string || "1");
        const limit = parseInt(req.query.limit as string || "10");
        const skip = (page-1)*limit;

        const users = await User.find({
            _id: {$ne: userId}
        }).skip(skip).limit(limit);
        const count = await User.countDocuments({
            _id: { $ne: userId }
          });
        
        res.status(200).send({
            message: "Total users are " + (count+1),
            users: users
        })
    } catch(err) {
        res.status(400).send("Failed")
    }
});

export default userRouter;

