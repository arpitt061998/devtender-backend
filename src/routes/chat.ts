import express, {Request, Response} from "express";
import userAuth from "../middleware/auth";
import { AuthRequest } from "../types/interface";
import Chat from "../model/chat";

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async(req: AuthRequest, res: Response) => {

  const {targetUserId} = req.params;
  const userId = req.user?._id;

  try {
    let chat = await Chat.findOne({
      participants: {$all: [userId, targetUserId]}
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName"
    });
    console.log("***chat***",chat?.messages)
    if(!chat){
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: []
      });
      await chat.save();
    }

    res.status(200).json({
      data: chat
    })
  } catch(err) {

  }

})


export default chatRouter;
