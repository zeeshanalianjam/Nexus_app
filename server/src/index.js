import { app } from "./app.js";
import dotenv from 'dotenv';
import { connectDB } from "./db/dbConnection.js";
import http from 'http';
import { Server } from 'socket.io';

dotenv.config({
    path: './.env'
});

let port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

// Store online users
const userSocketMap = {};

// Handle socket connections
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    }

    // Emit online users to all clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  
    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log('user disconnected', userId);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

connectDB().then(() => {
    app.on('error', (err) => {
        console.error('Server error:', err);
    });
    server.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1); 
});


export { io, userSocketMap }; // Export io and userSocketMap for use in other modules