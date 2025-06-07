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
            res.status(200).json({ message: "No connections found", data: connections });
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

userRouter.get("/user/feed", userAuth, async (req: AuthRequest, res: Response) => {
    try {
        const loggedInUser = req.user;
        const userId = loggedInUser?._id;

        if (!userId) {
            res.status(400).send("Invalid user ID");
            return;
        }

        const page = parseInt(req.query.page as string || "1");
        let limit = parseInt(req.query.limit as string || "10");

        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        // User should see all the user cards except:
        // their own card
        // ignored people
        // already sent connection requests

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: userId },
                { toUserId: userId }
            ]
        }).select("fromUserId toUserId");

        const hideUserIds = new Set<string>();
        hideUserIds.add(userId.toString()); // Exclude logged-in user's own card

        connectionRequests.forEach((connection) => {
            hideUserIds.add(connection.fromUserId.toString());
            hideUserIds.add(connection.toUserId.toString());
        });

        const feedUsers = await User.find({
            _id: { $nin: Array.from(hideUserIds) }
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.status(200).send({
            message: "Feeds are: ",
            data: feedUsers
        });
    } catch (err: any) {
        res.status(400).send("Error: " + err);
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


//test api to return all user for ashu 
userRouter.get("/users/all", async(req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json({
            count: users.length,
            users: users
        })
    } catch(err) {
        res.status(400).send("Failed")
    }
});

//test api to return all user for ashu 
userRouter.get("/user", async(req: Request, res: Response) => {
    try {
        
        const age = parseInt(req.query.age as string || "0");
        const fname = req.query.fname as string;
        
        const query: any = {
          age: { $gte: age }
        };
        
        if (fname) {
          query.firstName = { $regex: fname, $options: "i" }; // case-insensitive match
        }
        
        const users = await User.find(query);
        
        res.status(200).json({
            count: users.length,
            users: users,
        })
    } catch(err) {
        res.status(400).send("Failed")
    }
});

export default userRouter;

