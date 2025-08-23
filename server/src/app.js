import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();


const allowedOrigins = [
    'http://localhost:5173'
];
app.use(cors({
    origin : allowedOrigins,
    credentials: true
}));

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser())
app.use(express.static('public'));

// import routes
import {userRouter} from './routes/user.routes.js';
import { messageRouter } from './routes/message.routes.js';


// use routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/messages', messageRouter);


export { app };