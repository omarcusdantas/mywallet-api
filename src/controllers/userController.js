import { db } from "../database/database.connection.js";

export async function getTransactions(req, res) {
    const { email } = res.locals.session;

    try {
        const user = await db.collection("accounts").findOne({ email });
        return res.status(200).send(user);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function newTransaction(req, res) {
    const { email } = res.locals.session;
    const { value, description } = req.body;
    const type = req.params.tipo;
    const formatValue = Number(value);

    let changeBalance;

    if (type === "entrada") {
        changeBalance = formatValue;
    } else if (type === "saida") {
        changeBalance = -formatValue;
    } else {
        return res.status(400);
    }

    const transaction = {
        value: formatValue, 
        description, 
        type, 
        date: new Date(),
    }

    try {
        const user = await db.collection("accounts").findOne({ email });

        let newId;
        if(user.transactions.length === 0) {
            newId = 0;
        } else {
            newId = user.transactions[user.transactions.length-1].id + 1;
        }

        await db
            .collection("accounts")
            .updateOne(
                { email },
                {
                    $set: {
                        transactions: [...user.transactions, { ...transaction, id: newId}],
                        balance: user.balance + changeBalance,
                    },
                }
            );
        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function deleteTransaction(req, res) {
    const id = parseInt(req.params.id);
    const { email } = res.locals.session;

    if (isNaN(id)) {
        return res.sendStatus(400);
    }

    try {
        const user = await db.collection("accounts").findOne({ email });
        const transactionIndex = user.transactions.findIndex((t) => t.id === id);

        if (transactionIndex === -1) {
            return res.status(404).send("Transaction not found");
        }

        const updatedTransactions = [
            ...user.transactions.slice(0, transactionIndex),
            ...user.transactions.slice(transactionIndex + 1),
        ];

        let changeBalance;
        if (user.transactions[transactionIndex].type === "entrada") {
            changeBalance = -user.transactions[transactionIndex].value;
        } else {
            changeBalance = user.transactions[transactionIndex].value;
        }

        await db.collection("accounts").updateOne(
            { email },
            {
                $set: {
                    transactions: updatedTransactions,
                    balance: user.balance + changeBalance,
                },
            }
        );

        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function editTransaction(req, res) {
    const { email } = res.locals.session;
    const { value, description } = req.body;
    const type = req.params.tipo;
    const id = parseInt(req.params.id);
    const formatValue = Number(value)

    let changeBalance;

    if (type === "entrada") {
        changeBalance = formatValue;
    } else if (type === "saida") {
        changeBalance = -formatValue;
    } else {
        return res.status(400);
    }

    if (isNaN(id)) {
        return res.sendStatus(400);
    }

    try {
        const user = await db.collection("accounts").findOne({ email });
        const transactionIndex = user.transactions.findIndex((t) => t.id === id);

        if (transactionIndex === -1) {
            return res.status(404).send("Transaction not found");
        }

        const oldTransaction = user.transactions[transactionIndex];
        
        let fixBalance;
        if(oldTransaction.type === "entrada") {
            fixBalance = -oldTransaction.value;
        } else {
            fixBalance = oldTransaction.value;
        }

        const updatedTransactions = [...user.transactions];
        updatedTransactions[transactionIndex] = {
            value: formatValue,
            description,
            type,
            date: oldTransaction.date,
            id: oldTransaction.id,
        }

        await db
            .collection("accounts")
            .updateOne(
                { email },
                {
                    $set: {
                        transactions: [...updatedTransactions],
                        balance: user.balance + changeBalance + fixBalance,
                    },
                }
            );
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}
