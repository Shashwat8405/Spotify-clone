import express from"express";
import cors from "cors";
import cron from "node-cron";
import dotenv from"dotenv"; 
import {clerkMiddleware} from "@clerk/express";
import {connectDB} from "./lib/db.js";
import fileupload from "express-fileupload";
import path from "path";
import { createServer } from "http";
import {initializeSocket} from"./lib/socket.js";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statsRoutes from "./routes/stat.route.js"; 
dotenv.config();
const __dirname = path.resolve(); // Get the current directory name
const app = express();
const PORT = process.env.PORT;
const httpServer=createServer(app);
initializeSocket(httpServer);
app.use(cors(
  {
  origin: "http://localhost:3000",
  credentials:true,
 } // Allow requests from the frontend
));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(clerkMiddleware()); // Middleware for Clerk authentication this will add authentication to the request object=>auth.req.user
app.use(fileupload({
  useTempFiles: true, // Use temporary files for uploads
  tempFileDir: path.join(__dirname,"temp"), // Directory for temporary files
  createParentPath: true, // Create parent directories if they don't exist
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
}))
// cron
const tempDir=path.join(process.cwd(),"temp");
cron.schedule("0 * * * *", () => {
  if(fstat.existsSync(tempDir)){
    fs.readdir(tempDir,(err,files) => {
      if(err){ console.log("Error reading temp directory:",err);
        return;
  }
  for(const file of files){
    fs.unlink(path.join(tempDir,file),err => {});
  }
});
  }
});
app.use("/api/users",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/songs",songRoutes);
app.use("/api/albums",albumRoutes);
app.use("/api/stats",statsRoutes);
//error handling middleware
app.use((err,req,res,next) => {
  res.status(500).json({
    message: process.env.NODE_ENV ==="production" ? "Internal Server Error": err.message  });
});


httpServer.listen(PORT, () => {
  console.log("Server is running on port"+ PORT);
  connectDB(); // Ensure DB connection is established
}); 