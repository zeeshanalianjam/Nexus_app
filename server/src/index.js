import { app } from "./app.js";
import dotenv from 'dotenv';
import { connectDB } from "./db/dbConnection.js";

dotenv.config({
    path: './.env'
});

let port = process.env.PORT || 3000;

connectDB().then(() => {
    app.on('error', (err) => {
        console.error('Server error:', err);
    });
    app.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1); 
});