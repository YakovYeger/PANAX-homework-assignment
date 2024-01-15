import {pool} from "../db";
import {getTransactionsQuery, insertTransactionsQuery} from "./queries";
import {QueryValue, TransactionInterface} from "./types";

export const fetchTransactions = async (): Promise<TransactionInterface[]> => {
    const transactionData = await pool.query<TransactionInterface>(getTransactionsQuery);
    return transactionData.rows;
}

export const upsertTransaction = async (transactionValues: QueryValue[]): Promise<TransactionInterface[]> => {
    const {rows} = await pool.query<TransactionInterface>(insertTransactionsQuery, transactionValues)
    return rows;
}