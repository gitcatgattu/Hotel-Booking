import express from "express";
// import { } from "../middleware/authMiddleware.js";
import { getUserData, storeRecentSearchedCities } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/",  getUserData);
userRouter.post("/store-recent-search",  storeRecentSearchedCities);

export default userRouter;
