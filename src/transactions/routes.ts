import {Router, Request} from 'express'
import {getTransactions, uploadTransactionsFromCSV} from "./controller";
import multer from 'multer'
import path from 'path'

const uploadCsvFile = multer({
    dest: '/tmp/uploads',
    fileFilter: (req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
        if (path.extname(file.originalname) !== '.csv') {
            return callback(new Error('Only csv files allowed!'));
        }
        callback(null, true);
    },
})

export const transactionsRouter = Router()

transactionsRouter.get("/", getTransactions);
transactionsRouter.post("/csv", uploadCsvFile.single('file'), uploadTransactionsFromCSV);
