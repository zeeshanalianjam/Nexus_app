import { io, userSocketMap } from "../index.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { uploadImagetoCloudianry } from "../services/cloudinary.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { AsyncHandler } from "../utils/asyncHandler.js";

// Get all users except the login user
const getUsersForSidebar = AsyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        if(!userId) {
            return res.status(400).json(new ApiError(400, "User ID is required"));
        }   
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password -refreshToken");

        // count number of messages not seen by the user
        const unseenMessages = {};
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false
            })
            if(messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        })

        await Promise.all(promises);
        return res.status(200).json(new ApiResponse(200, "Users fetched successfully", {
            users: filteredUsers,
            unseenMessages
        }));

    } catch (error) {
         return res.status(500).json(new ApiError(500, "Error in getUserForSidebar", error.message));
    }
})


// Get all messages for selectedUser
const getMessages = AsyncHandler(async (req, res) => {
    try {
        const {id : selectedUserId} = req.params;
        const userId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });

        await Message.updateMany(
            { senderId: selectedUserId, receiverId: userId, seen: false },
            { $set: { seen: true } }
        );

        res.status(200).json(new ApiResponse(200, "Messages fetched successfully", messages));


    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error in fetching messages", error.message));
    }
})

const markMessageAsSeen = AsyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findByIdAndUpdate(id, { seen: true }, { new: true });

        if (!message) {
            return res.status(404).json(new ApiError(404, "Message not found"));
        }

        return res.status(200).json(new ApiResponse(200, "Message marked as seen successfully", message));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error in marking message as seen", error.message));
    }
})

// Mark all messages from a specific user as seen
const markMessagesAsSeen = AsyncHandler(async (req, res) => {
    try {
        const { senderId } = req.params;
        const receiverId = req.user._id;

        // Update all messages from senderId to receiverId as seen
        const result = await Message.updateMany(
            { senderId, receiverId, seen: false },
            { $set: { seen: true } }
        );

        return res.status(200).json(new ApiResponse(200, `Marked ${result.modifiedCount} messages as seen`, {
            modifiedCount: result.modifiedCount
        }));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error in marking messages as seen", error.message));
    }
});


const sendMessage = AsyncHandler(async (req, res) => {
    try {
        const {text} = req.body;
        const senderId = req.user._id;
        const receiverId = req.params.id;

        const newMessage = await Message.create({
            text,
            senderId,
            receiverId
        });

        // Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        return res.status(201).json(new ApiResponse(201, "Message sent successfully", newMessage));

    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error in sending message", error.message));
    }
})

const sendMessageImage = AsyncHandler(async (req, res) => {
    try {
        const image = req?.file?.path;
        const senderId = req.user._id;
        const receiverId = req.params.id;

        const response = await uploadImagetoCloudianry(image);
        const imageUrl = response.url;

        const newMessage = await Message.create({
            image: imageUrl,
            senderId,
            receiverId
        });

        // Emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }

        return res.status(201).json(new ApiResponse(201, "Message sent successfully", newMessage));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error in sending message", error.message));
    }
})

export { getUsersForSidebar, getMessages, markMessageAsSeen, sendMessage, sendMessageImage, markMessagesAsSeen };