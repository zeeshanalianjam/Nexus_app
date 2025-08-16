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


const sendMessage = AsyncHandler(async (req, res) => {
    try {
        const {text, image} = req.body;
        const senderId = req.user._id;
        const receiverId = req.params.id;

        let imageUrl = "";
        if (image) {
           const response  = uploadImagetoCloudianry(image)
              imageUrl = response.url;
        }

        const newMessage = await Message.create({
            text,
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

export { getUsersForSidebar, getMessages, markMessageAsSeen, sendMessage };