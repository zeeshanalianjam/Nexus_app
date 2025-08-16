import { User } from "../models/user.model.js";
import { uploadImagetoCloudianry } from "../services/cloudinary.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { AsyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens:", error);
        throw new ApiError(500, "Internal server error while generating tokens");
    }
}

const register = AsyncHandler(async (req, res) => {
    try {
        const { username, email, password, bio, role } = req.body;
        if (!username || !email || !password || !bio || !role) {
            return res.status(400).json(new ApiError(400, "All fields are required"));
        }

        const existingUser = await User.findOne({ email });
        if (existingUser?.length > 0) {
            return res.status(400).json(new ApiError(400, "You are already exists with this email"));
        }

        if (password?.length < 6) {
            return res.status(400).json(new ApiError(400, "Password must be at least 6 characters long"));
        }
        
        const newUser = await User.create({
            username,
            email,
            password,
            bio,
            role
        });

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(newUser._id);

        const cookieOptions = {
            httpOnly: true,
            secure: true,
        }

        const user = await User.findById(newUser._id).select("-password -refreshToken");

        return res.status(201).cookie("refreshToken", refreshToken, cookieOptions).cookie("accessToken", accessToken, cookieOptions).json(new ApiResponse(201, "You have been registered successfully", {
            user,
            accessToken,
            refreshToken,
        }));

    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error in register the user", error.message));
    }
})


const login = AsyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json(new ApiError(400, "All fields are required"));
        }

        const alreadyExistUser = await User.findOne({ email });
        if (!alreadyExistUser) {
            return res.status(404).json(new ApiError(404, "You are not registered with this email"));
        }
        const isPasswordMatch = await alreadyExistUser.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(400).json(new ApiError(400, "Invalid credentials your password is incorrect"));
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(alreadyExistUser._id);

        const cookieOptions = {
            httpOnly: true,
            secure: true,
        }

        const loginUser = await User.findById(alreadyExistUser._id).select("-password -refreshToken");

        return res.status(200).cookie("refreshToken", refreshToken, cookieOptions).cookie("accessToken", accessToken, cookieOptions).json(
            new ApiResponse(200, "You have been logged in successfully", {
                user: loginUser,
                accessToken,
                refreshToken,
            })
        );

    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error in login the user", error.message));
    }
});

const updateUserProfile = AsyncHandler(async (req, res) => {
    try {
       const user = await User.findOne({_id: req.params._id})
        if (!user) {
            return res.status(404).json(new ApiError(404, "Your credentials are not valid"));
        }
        
        Object.assign(user, req.body);
        const savedUser = await user.save();

        return res.status(200).json(new ApiResponse(200, "Your profile updated successfully", savedUser));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error in updating user profile", error.message));
    }
})

const updateUserProfileImage = AsyncHandler(async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params._id });
        if (!user) {
            return res.status(404).json(new ApiError(404, "Your credentials are not valid"));
        }
        const image = req?.file?.path;
        if (!image) {
            return res.status(400).json(new ApiError(400, "Profile image is required"));
        }

        const uploadedImage = await uploadImagetoCloudianry(image);

        user.profilePicture = uploadedImage.url;
        const updatedUser = await user.save(); 
        return res.status(200).json(new ApiResponse(200, "Profile image updated successfully", updatedUser));

    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error in updating user profile image", error.message));
    }
})

const getAllUsers = AsyncHandler(async (req, res) => {
    try {
        const users = await User.find().select("-password -refreshToken");
        if (!users || users.length === 0) {
            return res.status(404).json(new ApiError(404, "No users found"));
        }
        return res.status(200).json(new ApiResponse(200, "All users fetched successfully", users));
        
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error in fetching all users", error.message));
    }
})

const getUserById = AsyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params._id).select("-password -refreshToken");
        if (!user) {
            return res.status(404).json(new ApiError(404, "Your credentials are not valid"));
        }
        return res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
    } catch (error) {
         return res.status(500).json(new ApiError(500, "Error in fetching user by id", error.message));
    }
})

const checkAuth = AsyncHandler(async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json(new ApiResponse(200, "User authenticated successfully", user));
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error in checking authentication", error.message));
    }
})


export { register, login, updateUserProfile, generateAccessAndRefreshTokens, updateUserProfileImage, getAllUsers, getUserById, checkAuth };
