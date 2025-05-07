import mongoose , {Schema, Document} from "mongoose";


interface IConnectionRequest extends Document {
    fromUserId: mongoose.Schema.Types.ObjectId;
    toUserId: mongoose.Schema.Types.ObjectId;
    status: string; //
}

const connectionRequestSchmema = new Schema<IConnectionRequest>(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",  // reference to user collection
            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",  //refrence to user collections
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "accepted", "rejected", "interested"],
                message: `{VALUE} is not a valid status`
            },
        },
    },
    {timestamps: true}
);

// we are doing here compound indexing it makes queries very very faster
connectionRequestSchmema.index({fromUserId: 1, toUserId: 1});

//this function will always run before save is called for our schema and we need to always use normal function instead of arrow function
connectionRequestSchmema.pre("save", function (next) {
    const connectionRequest = this as any;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        return next(new Error("Cannot send request to yourself"));
    }

    next();
});

const ConnectionRequest = mongoose.model<IConnectionRequest>('ConnectionRequest', connectionRequestSchmema);
export default ConnectionRequest;
