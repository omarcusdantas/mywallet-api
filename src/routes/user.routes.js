import { Router } from "express";
import { validateAuth } from "../middlewares/validateAuth.js";
import { getTransactions } from "../controllers/userController.js";

const userRouter = Router();
userRouter.get("/home", validateAuth, getTransactions);

export default userRouter;