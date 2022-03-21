import express from "express";
import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { dbConnect } from "./helper";

const app = express();
dotenv.config();

interface User {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    passwordConfirm?: string;
    created_at?: string;
    updated_at?: string;
}

const mysqlTimeStamp: string = new Date().toJSON().slice(0, 19).replace('T', ' ');

app.use(express.json());

app.get('/users', async (req: any, res: any): Promise<void> => {
    const SQLReturnUserList: string = 'SELECT first_name, last_name FROM users';
    const results = await dbConnect(req, res, SQLReturnUserList);
    return res.status(400).send({ results });
});

app.post('/register', async (req: { body: User; }, res: any): Promise<any> => {
    const { 
        first_name,
        last_name,
        email,
        password,
        passwordConfirm,
    }: User = req.body;
    
    // Password Check
    if (password !== passwordConfirm) {
        return res.status(400).send({ message: 'Passwords do not match.' });
    }
    // Check if email is in use
    const SQLCheckEmail: string = `SELECT email FROM users WHERE email = '${email}'`;

    const checkEmailResults: any = await dbConnect(req, res, SQLCheckEmail);
    console.log(checkEmailResults, 'test');
    if (password !== passwordConfirm) {
        return res.status(400).send({ message: 'Passwords do not match.' });
    }

    if (checkEmailResults.length > 0) {
        return res.status(400).send({ message: 'That email is already in use.' });
    } 

    // If email is not in use, create hash and write to DB
    const hashPassword: string = await bcrypt.hash(req.body.password, 10);
    
    const SQLCreateUser: string = 'INSERT INTO users SET ?';
    const SQLCreateUserObj: User = {
        first_name, 
        last_name,
        email,
        password: hashPassword, 
        created_at: mysqlTimeStamp, 
        updated_at: mysqlTimeStamp,
    }

    try {
        const createUserResults: any = await dbConnect(req, res, SQLCreateUser, SQLCreateUserObj);
        res.status(200).send({ message: 'User successfully registered.' });
    } catch(error) {
        console.log(error, 'what happen');
    }
});

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
