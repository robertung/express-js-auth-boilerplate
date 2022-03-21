import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: 3306,
});

export async function dbConnect(req: any, res: any, sqlStatement: string, args: {} = {}): Promise<void> {
    return new Promise((resolve, reject) => {
        db.query(sqlStatement, args, (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    });
}