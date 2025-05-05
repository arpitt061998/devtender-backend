import { Response } from "express";
const requestRouter = require("express").Router();
import userAuth from "../middleware/auth";
import { AuthRequest } from "../types/interface";
import ConnectionRequest from "../model/connectionRequest";
import User from "../model/user";

requestRouter.post("/sendConnectionRequest", userAuth, (req: AuthRequest, res: Response) => {
    res.send(req.user?.firstName+ " the sent connection request ");
});

requestRouter.post("/request/send/:status/:toUserId",
    userAuth,
    async (req: AuthRequest, res: Response) => {
        try {
            const fromUserId = req.user?._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;

            // if(fromUserId === toUserId){
            //     return res.status(400).json({
            //         message: "User cannot send connection request to himself"
            //     })                
            // }

            const allowedStatus = ["ignored","interested"];

            if(!allowedStatus.includes(status)){
                return res.status(400).json({
                    message: "Invalid status type: "+ status
                })
            }

            const toUser = await User.findById(toUserId);
            if(!toUser){
                return res.status(400).json({
                    message: "Invalid user"
                })             
            }

            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status
            });

            //if there is a existing connection request
            const existingConnectinRequest = await ConnectionRequest.findOne({
                $or: [
                    {fromUserId, toUserId},
                    {fromUserId: toUserId, touserId: fromUserId}
                ]
            });

            if(existingConnectinRequest){
                return res.status(400).send("Connection request already exists!!");
            }

            const data = await connectionRequest.save();

            res.status(200).json({
                message: "Connection Request sent successfully",
                data
            });
        } catch (err) {
            res.status(400).send("Connection request failed"+err)
        }
    }
);

export default requestRouter;