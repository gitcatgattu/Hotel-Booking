import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { } from "../middleware/authMiddleware.js";
import { createRoom, getOwnerRooms, getRooms, toggleRoomAvailability } from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.post("/", upload.array("images", 4),  createRoom);
// roomRouter.get("/", getRooms);
roomRouter.get("/owner",  getOwnerRooms);
roomRouter.post("/toggle-availability",  toggleRoomAvailability);

export default roomRouter;
