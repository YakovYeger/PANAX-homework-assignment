export interface TransactionInterface {
    account_mask: number;
    description: string;
    details: string;
    amount: number;
    balance: number;
    reference_number?: string;
    currency: string;
    type: string;
    posted_date: Date;
    updated_at?: Date;
    created_at?: Date
}

export const CsvTransactionMap = {
    ["Account Mask"]: 'account_mask',
    'Description': 'description',
    'Details': 'details',
    'Amount': 'amount',
    'Balance': 'balance',
    ['Reference Number']: 'reference_number',
    ['Posted Date']: 'posted_date',
    'currency': 'currency',
    'type': 'type',
} as const;

export type TransactionCsvKeys = keyof typeof CsvTransactionMap;

export type TransactionTableKeys = (typeof CsvTransactionMap)[TransactionCsvKeys];

export type TransactionObject = Record<TransactionTableKeys, string>;

export type QueryValue = string | null;