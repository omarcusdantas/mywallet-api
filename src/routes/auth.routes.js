import { Router } from "express";
import { signup, signin } from "../controllers/authController.js";
import { validateSchema } from "../middlewares/validateSchema.js"
import { schemaSignup, schemaSignin } from "../schemas/auth.schemas.js"

const authRouter = Router();
authRouter.post("/cadastro", validateSchema(schemaSignup), signup);
authRouter.post("/", validateSchema(schemaSignin), signin);

export default authRouter;