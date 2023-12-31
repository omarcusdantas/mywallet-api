import { db } from "../database/database.connection.js";

export async function validateAuth(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const session = await db.collection("sessions").findOne({ token });

        if (!session) {
            return res.sendStatus(401);
        }
        res.locals.session = session;
        next();
    } catch (error) {
        return res.status(500).send(error.message);
    }
}
