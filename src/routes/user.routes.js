import { Router } from "express";
import { validateAuth } from "../middlewares/validateAuth.js";
import { getTransactions, newTransaction, deleteTransaction, editTransaction } from "../controllers/userController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { schemaTransaction } from "../schemas/user.schemas.js";

const userRouter = Router();
userRouter.get("/home", validateAuth, getTransactions);
userRouter.post("/nova-transacao/:tipo", validateAuth, validateSchema(schemaTransaction), newTransaction);
userRouter.delete("/deleta-transacao/:id", validateAuth, deleteTransaction);
userRouter.put("/editar-registro/:tipo/:id", validateAuth, validateSchema(schemaTransaction), editTransaction);

export default userRouter;