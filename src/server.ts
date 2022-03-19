const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

interface User {
    name: string;
    password: string;
}

app.use(express.json());

let users: User[] = [];
const posts: User[] = [];

app.get('/post', (req: any, res: any): void => {
    res.json(posts);
});
app.get('/users', (req: any, res: { json: (arg0: any) => void; }): void => {
    res.json(users);
});

app.post('/createuser', async (req: { body: User; }, res: any): Promise<void> => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const user = {
            name: req.body.name,
            password: hashPassword,
        };
        users.push(user);
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});

app.post('/login', async (req: { body: User; }, res: any): Promise<void> => {
    const user = users.find((user: { name: any; }) => user.name === req.body.name);
    if (user === undefined) {
        return res.status(400).send('Cannot find user');
    }
    try {
        const message = await bcrypt.compare(req.body.password, user.password)
            ? 'success'
            : 'failed';
        
        res.send(message);

    } catch {
        res.status(500)
    }
});

app.listen(8080);
