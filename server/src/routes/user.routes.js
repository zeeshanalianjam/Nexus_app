import { Router } from 'express';
import { getAllUsers, getUserById, login, register, updateUserProfile, updateUserProfileImage } from '../controllers/user.controller.js';
import { jwtVerify } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const userRouter = Router();

userRouter.route('/register').post(register);
userRouter.route('/login').post(login);

// secure routes
userRouter.route('/update-profile/:_id').put( jwtVerify, updateUserProfile);
userRouter.route('/update-profile-image/:_id').put(jwtVerify, upload.single("image"), updateUserProfileImage);
userRouter.route('/getAllUsers').get( jwtVerify, getAllUsers);
userRouter.route('/get-user-by-id/:_id').get(jwtVerify, getUserById);

export { userRouter};