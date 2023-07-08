import bcrypt from "bcrypt"
import { db } from "../database/database.connection.js"

export async function signup(req, res) {
    const { name, email, password } = req.body

    try {
        const foundUser = await db.collection("users").findOne({ email });

        if (foundUser) {
            return res.status(409).send("Email already registered.");
        }

        const hash = bcrypt.hashSync(password, 10);

        await db.collection("users").insertOne({ name, email, password: hash });
        await db.collection("balances").insertOne({ email, balance: 0 });
        await db.collection("transactions").insertOne({ email, transactions: [] });

        return res.sendStatus(201);
    } catch(error) {
        return res.status(500).send({ message: error.message });
    }
}
