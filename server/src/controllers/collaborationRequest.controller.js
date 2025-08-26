import { CollaborationRequest } from "../models/collaborationRequest.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { AsyncHandler } from "../utils/asyncHandler.js";

const sendRequest = AsyncHandler(async (req, res) => {
    try {
        const senderId = req.user._id;
        const receiverId = req.params.id;

        if (senderId.toString() === receiverId) {
            return res.status(400).json(new ApiError(400, "You cannot send a request to yourself"));
        }

        const request = await CollaborationRequest.findOne({
            $or: [
                { senderId: senderId, receiverId: receiverId, status: "pending" },
                { senderId: receiverId, receiverId: senderId, status: "pending" }
            ]
        })

        if (request) {
            return res.status(400).json(new ApiError(400, "You have already sent a request to this user"));
        }

        const newRequest = await CollaborationRequest.create({
            senderId,
            receiverId
        })

        return res.status(201).json(new ApiResponse(201, "Request sent successfully", newRequest));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error in sending request", error.message));
    }
})

const respondRequest = AsyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json(new ApiError(400, "Invalid status"));
        }

        const request = await CollaborationRequest.findById(id);
        if (!request) {
            return res.status(400).json(new ApiError(400, "Request not found"));
        }

        if (request.receiverId.toString() !== req.user._id.toString()) {
            return res.status(400).json(new ApiError(400, "You are not authorized to accept this request"));
        }

        request.status = status;
        await request.save();
        return res.status(200).json(new ApiResponse(200, `Request ${status} successfully`, request));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error in accepting request", error.message));
    }
})

const getPendingRequests = AsyncHandler(async (req, res) => {
    try {
        const requests = await CollaborationRequest.find({ receiverId: req.user._id, status: "pending" })
            .populate("senderId", "username email role");

        return res.status(200).json(new ApiResponse(200, "Requests fetched successfully", requests));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error in fetching requests", error.message));
    }
})

const getCollaborators = AsyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        const requests = await CollaborationRequest.find({
            $or: [
                { senderId: userId, status: "accepted" },
                { receiverId: userId, status: "accepted" }
            ]
        })
            .populate("senderId", "username email role")
            .populate("receiverId", "username email role");

        return res.status(200).json(new ApiResponse(200, "Collaborators fetched successfully", requests));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error in fetching collaborators", error.message));
    }
})

export { sendRequest, respondRequest, getPendingRequests, getCollaborators };