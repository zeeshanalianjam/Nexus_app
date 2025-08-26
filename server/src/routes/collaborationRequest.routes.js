import { Router } from 'express';
import { getCollaborators, getPendingRequests, respondRequest, sendRequest } from '../controllers/collaborationRequest.controller.js';
import { jwtVerify } from '../middleware/auth.middleware.js';

const collaborationRequestRouter = Router() 

collaborationRequestRouter.route("/send-request/:id").post(jwtVerify, sendRequest);
collaborationRequestRouter.route("/get-pending-requests").get(jwtVerify, getPendingRequests);
collaborationRequestRouter.route("/response/:id").put(jwtVerify, respondRequest);
collaborationRequestRouter.route("/get-collaborators").get(jwtVerify, getCollaborators);


export { collaborationRequestRouter };

