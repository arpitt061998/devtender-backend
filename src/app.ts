import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/database';
import profileRouter from './routes/profile';
import authRouter from './routes/auth';
import requestRouter from './routes/request';
import userRouter from './routes/user';
import cors from 'cors';
import http from 'http';
import intializeSocket from "./utils/socket";
import chatRouter from "./routes/chat";

const app = express();

const port = process.env.PORT || 3000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH" ,"DELETE"],
}));
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
intializeSocket(server);

connectDB().then(() => {
    console.log("databse connection established");
    server.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}).catch((err: Error )=> {
    console.error("database cannot be connected");
})
