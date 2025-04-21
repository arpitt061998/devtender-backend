import { Request } from "express";
import { IUser } from "../model/user";

export interface AuthRequest extends Request {
  user?: IUser;
}