import { ApiError } from "../utils/apiError.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";


const jwtVerify = AsyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers?.authorization?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json(new ApiError(401, "Access token is required"));
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        req.user = user;
        next();
        
    } catch (error) {
        return res.status(401).json(new ApiError(401, "Unauthorized access", error.message));
    }
})

export { jwtVerify };