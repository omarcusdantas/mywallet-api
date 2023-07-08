import { Router } from "express";
import { signup, signin, signout } from "../controllers/authController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { schemaSignup, schemaSignin } from "../schemas/auth.schemas.js";
import { validateAuth } from "../middlewares/validateAuth.js";

const authRouter = Router();
authRouter.post("/cadastro", validateSchema(schemaSignup), signup);
authRouter.post("/", validateSchema(schemaSignin), signin);
authRouter.delete("/signout", validateAuth, signout);

export default authRouter;