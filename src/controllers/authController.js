import bcrypt from "bcrypt";
import { db } from "../database/database.connection.js";
import { v4 as uuidv4 } from "uuid";

export async function signup(req, res) {
    const { name, email, password } = req.body;

    try {
        const foundUser = await db.collection("users").findOne({ email });

        if (foundUser) {
            return res.status(409).send("Email already registered.");
        }

        const hash = bcrypt.hashSync(password, 10);

        await db.collection("users").insertOne({ name, email, password: hash });
        await db.collection("accounts").insertOne({ name, email, balance: 0, transactions: [] });

        return res.sendStatus(201);
    } catch(error) {
        return res.status(500).send(error.message);
    }
}

export async function signin(req, res) {
    const { email, password } = req.body;

    try {
        const foundUser = await db.collection("users").findOne({ email });

        if (!foundUser) {
            return res.status(404).send("Email not registered.");
        }

        if (bcrypt.compareSync(password, foundUser.password)) {
            const token = uuidv4();
            await db.collection("sessions").insertOne({ email: foundUser.email, token });

            return res.status(200).send(token);
        }
        return res.status(401).send("Wrong password");
    } catch(error) {
        return res.status(500).send(error.message);
    }
}

export async function signout(req, res) {
    const { token } = res.locals.session;

    try {
        await db.collection("sessions").deleteOne({ token });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}
