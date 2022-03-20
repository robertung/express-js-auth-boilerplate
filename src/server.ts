import express from "express";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcrypt";
import mysql from "mysql";
import jwt from "jsonwebtoken";

const app = express();
dotenv.config();

interface User {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: 3306,
});

const mysqlTimeStamp: string = new Date().toJSON().slice(0, 19).replace('T', ' ');

db.connect((err) => {
    if (err) {
      console.error(`error connecting: ${err.stack}`);
      return;
    }
    console.log(`DB as id ${db.threadId}`);
});

app.use(express.json());

app.get('/users', (req: any, res: any): void => {
    const sqlReturnUserList: string = 'SELECT first_name, last_name FROM users';
    db.connect();
    db.query(sqlReturnUserList, async (error, results) => {
        if (error) {
            res.status(500).send({ 
                message: 'Error',
                error,
            });
        }
        if (results.length > 0) {
            return res.status(400).send({ results });
        } 
    });
    db.end();
});

app.post('/register', async (req: { body: User; }, res: any): Promise<void> => {
    const { 
        first_name,
        last_name,
        email,
        password,
        passwordConfirm,
    }: User = req.body;
    
    // Check if email is in use
    const sqlCheckEmail: string = `SELECT email FROM users WHERE email = '${email}'`;
    
    db.connect();
    db.query(sqlCheckEmail, async (error, results) => {
        if (error) {
            res.status(500).send({ 
                message: 'Error',
                error,
            });
        }
        
        if (password !== passwordConfirm) {
            return res.status(400).send({ message: 'Passwords do not match.' });
        }

        if (results.length > 0) {
            return res.status(400).send({ message: 'That email is already in use.' });
        } 
    });
    db.end();

    // If email is not in use, create hash and write to DB
    const hashPassword: string = await bcrypt.hash(req.body.password, 10);
    
    db.connect();
    db.query('INSERT INTO users SET ?', { first_name, last_name, email,  password: hashPassword, created_at: mysqlTimeStamp, updated_at: mysqlTimeStamp }, (error, results) => {
        if (error) {
            res.status(500).send({ 
                message: 'Error creating user',
                error,
            });
        } else {
            res.status(200).send({ message: 'User successfully registered.' });
        }
    });
    db.end();
});

// Response<any, Record<string, any>, number> 
app.post('/login', async (req: { body: User; }, res)  => {
// app.post('/login', async (req: { body: User; }, res): void | Response<any, Record<string, any>, number>  => {
    // const user: User | undefined = users.find((user: { name: string; }) => user.name === req.body.name);
    // if (user === undefined) {
    //     return res.status(400).send('Cannot find user');
    // }
    try {
        // const message = await bcrypt.compare(req.body.password, user.password)
        //     ? 'success'
        //     : 'failed';
        
        // res.send(message);

    } catch {
        res.status(500)
    }
});

app.listen(process.env.SERVER_PORT,() => {
    console.log(`Server started at http://localhost:${process.env.SERVER_PORT}`);
});
