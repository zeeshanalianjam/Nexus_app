import mongoose from "mongoose";

const collaborationRequestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
}, {timestamps: true});

export const  CollaborationRequest = mongoose.model("CollaborationRequest", collaborationRequestSchema);