import socket from "socket.io";
import crypto from "crypto";
import Chat from "../model/chat";

const getSecretRoomId = ({ userId, targetUserId }: { userId: string; targetUserId: string }): string => {
  const sortedIds = [userId, targetUserId].sort(); // Sort the user IDs alphabetically
  return crypto.createHash("sha256").update(sortedIds.join("_")).digest("hex"); // Hash the sorted IDs
};

const intializeSocket = (server: any) => {
    const io = new socket.Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected");

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });

        socket.on("joinChat", ({userId, targetUserId}) => {
          const roomId = getSecretRoomId({ userId, targetUserId });
          console.log("joining room ",roomId)
          socket.join(roomId);
        })

        socket.on("leaveChat", () => {
          console.log("User left chat");
        })

        socket.on("sendMessage", async({userId, targetUserId, firstName, text}) => {
          try {
            const roomId = getSecretRoomId({ userId, targetUserId });
            console.log(firstName," says", text);
            
            let chat = await Chat.findOne({
              participants: {$all: [userId, targetUserId]}
            });

            if(!chat){
              chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
              })
            }

            chat.messages.push(chat.messages.create({
              senderId: userId,
              text
            }));

            await chat.save();

            //save message to db

            io.to(roomId).emit("messsgeRecieved", {firstName, text, createdAt: new Date()});
          } catch(err) {
            console.log(err)
          }
        });
    });
}

export default intializeSocket;