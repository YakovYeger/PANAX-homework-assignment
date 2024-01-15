import {fetchTransactions, upsertTransaction} from "./model";
import {Request, Response} from "express";
import csv from 'csv-parser'
import fs from 'fs'
import {TransactionCsvKeys, CsvTransactionMap, TransactionTableKeys, TransactionObject, QueryValue} from "./types";

const referenceNumber = 'reference_number';

export const getTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await fetchTransactions();
        res.status(200).send({status: 'success', data: transactions});
    } catch (e) {
        res.status(500).send('Failed to fetch transactions');
    }
}

export const uploadTransactionsFromCSV = async (req: Request, res: Response) => {
    const file = req.file?.path ?? '';

    try {
        const results = await streamTransactionsFromCSV(file);
        res.status(200).send({
            status: 'Success',
            data: results,
            message: 'successfully uploaded/updated transactions'
        });
    } catch (e) {
        res.status(500).send({
            status: 'Failed',
            message: `Failed to upload csv data`
        });
    }
}


const processDataIntoTransaction = (data: Record<TransactionTableKeys, string | null>): QueryValue[] => {
    if (data[referenceNumber] === "") {
        data[referenceNumber] = null
    }
    return Object.values(data)
}

const streamTransactionsFromCSV = async (filePath: string): Promise<TransactionObject[]> => {
    const results: Record<TransactionTableKeys, string>[] = [];

    return new Promise<TransactionObject[]>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({
                mapHeaders: ({header}) => {
                    return CsvTransactionMap[header as TransactionCsvKeys]
                }
            }))
            .on('data', (data) => {
                const transaction = processDataIntoTransaction(data);
                results.push(data);
                upsertTransaction(transaction);
            })
            .on('end', () => {
                resolve(results)
            }).on('error', (err: Error) => {
            console.error('Failed to upload transactions', err);
            reject(err);
        });
    })
}

