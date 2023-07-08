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

export async function newTransaction(req, res) {
    const { email } = res.locals;
    const { value, description } = req.body;
    const type = req.params.tipo;
    let changeBalance;

    if (type === "entrada") {
        changeBalance = value;
    } else if (type === "saida") {
        changeBalance = -value;
    } else {
        return res.status(400);
    }

    try {
        const user = await db.collection("accounts").findOne({ email });

        await db
            .collection("accounts")
            .updateOne(
                { email },
                {
                    $set: {
                        transactions: [...user.transactions, { value, description, type, date: new Date() }],
                        balance: user.balance + changeBalance,
                    },
                }
            );
        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).send({ message: err.message });
    }
}
