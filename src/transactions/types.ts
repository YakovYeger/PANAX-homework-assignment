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

export const CsvToTableTransactionMap = {
    ["Account Mask"]: 'account_mask',
    ['Posted Date']: 'posted_date',
    'Description': 'description',
    'Details': 'details',
    'Amount': 'amount',
    'Balance': 'balance',
    ['Reference Number']: 'reference_number',
    'currency': 'currency',
    'type': 'type',
} as const;

export type TransactionCsvKeys = keyof typeof CsvToTableTransactionMap;

export type TransactionTableKeys = (typeof CsvToTableTransactionMap)[TransactionCsvKeys];

export type TransactionObject = Record<TransactionTableKeys, string>;

export type QueryValue = string | null;