import { Router } from 'express';
import { jwtVerify } from '../middleware/auth.middleware.js';
import { getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../controllers/message.controller.js';

const messageRouter = Router();

messageRouter.route("/users").get(jwtVerify, getUsersForSidebar)
messageRouter.route("/:id").get(jwtVerify, getMessages);
messageRouter.route("/mark/:id").put(jwtVerify, markMessageAsSeen);
messageRouter.route("/send/:id").post(jwtVerify, sendMessage);

export { messageRouter };