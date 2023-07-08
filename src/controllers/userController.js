import { db } from "../database/database.connection.js";

export async function getTransactions(req, res) {
    const { email } = res.locals;

    try {
        const user = await db.collection("accounts").findOne({ email });
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send({ message: err.message });
    }
}
