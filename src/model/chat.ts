import mongoose, {Schema, Document} from "mongoose";

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId; // references User
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[]; // array of User references
  messages: mongoose.Types.DocumentArray<IMessage>;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new mongoose.Schema<IMessage> ({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, {timestamps: true});

const chatSchema = new mongoose.Schema <IChat>(
  {
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}],
    messages: [messageSchema]
  }
)

const Chat = mongoose.model<IChat>("Chat", chatSchema);
export default Chat;


