import { Response } from "express";
const requestRouter = require("express").Router();
import userAuth from "../middleware/auth";
import { AuthRequest } from "../types/interface";
requestRouter.post("/sendConnectionRequest", userAuth, (req: AuthRequest, res: Response) => {
    res.send(req.user?.firstName+ " the sent connection request ");
});

export default requestRouter;