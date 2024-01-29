import {fetchTransactions, upsertTransaction} from "./model";
import {Request, Response} from "express";
import csv from 'csv-parser'
import fs from 'fs'
import {CsvToTableTransactionMap, QueryValue, TransactionCsvKeys, TransactionObject, TransactionTableKeys} from "./types";

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
        const results = await uploadTransactionsFromFile(file);
        res.status(200).send({
            status: 'Success',
            data: results,
            message: 'successfully uploaded/updated transactions'
        });
    } catch (e) {
        res.status(500).send({
            status: 'Failed',
            message: `Failed to upload csv data: ${(e as Error)?.message}`
        });
    }
}


const processDataIntoTransaction = (data: Record<TransactionTableKeys, string | null>): QueryValue[] => {
    if (data[referenceNumber] === "") {
        data[referenceNumber] = null
    }
    return Object.values(data);
}

const isValidTransactionHeaders = (headers: string[]): boolean => {
    return headers.toString() === Object.values(CsvToTableTransactionMap).toString()
}

const uploadTransactionsFromFile = async (filePath: string): Promise<TransactionObject[]> => {
    const results: Record<TransactionTableKeys, string>[] = [];

    return new Promise<TransactionObject[]>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv({
                mapHeaders: ({header}) => {
                    return CsvToTableTransactionMap[header as TransactionCsvKeys]
                }
            }))
            .on('headers', (headers) => {
                if(!isValidTransactionHeaders(headers)){
                    reject(new Error('invalid headers'))
                    console.error('invalid headers')
                };
            })
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

