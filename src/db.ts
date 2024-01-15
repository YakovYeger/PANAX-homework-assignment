import {Pool} from 'pg'

export const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    database: process.env.DB_NAME || 'panax',
    password: process.env.DB_PASSWORD || '123',
    port: Number(process.env.DB_PORT) || 5432,
})

