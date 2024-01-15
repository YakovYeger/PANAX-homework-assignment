import {pool} from "../db";

export const getTransactionsQuery = 'SELECT * FROM transactions';

export const insertTransactionsQuery = `
    INSERT INTO transactions (account_mask, posted_date, description, details, amount, balance, reference_number,
                              currency, type)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT(reference_number) DO UPDATE
        SET (account_mask, posted_date, description, details, amount, balance, reference_number,
             currency, type, updated_at) = (excluded.account_mask, excluded.posted_date, excluded.description,
                                            excluded.details, excluded.amount, excluded.balance,
                                            excluded.reference_number,
                                            excluded.currency, excluded.type, NOW())
    RETURNING *;
`;

export const createTransactionsTableQuery = `
    CREATE TABLE IF NOT EXISTS "transactions"
    (
        "account_mask"     INTEGER      NOT NULL,
        "description"      VARCHAR(100) NOT NULL,
        "details"          VARCHAR(15)  NOT NULL,
        "amount"           INTEGER      NOT NULL,
        "balance"          INTEGER      NOT NULL,
        "reference_number" VARCHAR(15) UNIQUE NULLS DISTINCT,
        "currency"         VARCHAR(3)   NOT NULL,
        "type"             VARCHAR(15)  NOT NULL,
        "posted_date"      DATE         NOT NULL,
        "updated_at"       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        "created_at"       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )`;

export async function createTransactionsTable() {
    await pool.query(createTransactionsTableQuery);
}