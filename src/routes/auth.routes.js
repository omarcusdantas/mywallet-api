import { Router } from "express";
import { signup } from "../controllers/authController.js";
import { validateSchema } from "../middlewares/validateSchema.js"
import { schemaSignup } from "../schemas/user.schemas.js"

const authRouter = Router();
authRouter.post("/cadastro", validateSchema(schemaSignup), signup)

export default authRouter;