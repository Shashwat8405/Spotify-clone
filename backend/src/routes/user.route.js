import { Router } from "express";   
import { protectRoute } from "../middleware/auth.middleware.js"; // Import the protectRoute middleware to secure the route
import { getAllUsers ,getMessages} from "../controller/user.controller.js";
const router =Router();
router.get("/",protectRoute,getAllUsers); // Protect this route with authentication middleware 
router.get("/messages/:userId",protectRoute,getMessages);


export default router;