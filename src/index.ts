import express, {Express} from "express";
import dotenv from "dotenv";
import {transactionsRouter} from "./transactions/routes";
import {createTransactionsTable} from "./transactions/queries";

dotenv.config();

const app: Express = express();
const port = Number(process.env.PORT) || 3000;

app.use('/transactions', transactionsRouter);

app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`);
    await createTransactionsTable();
});