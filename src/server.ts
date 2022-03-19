// const express = require('express');
const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

// interface User {
//     name: string;
//     password: string;
// }

app.use(express.json());

let users: any = [];
const posts: [] = [];

app.get('/post', (req, res) => {
    res.json(posts);
});
app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/createuser', async (req, res) => {
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

app.post('/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name);
    if (user === undefined) {
        return res.status(400).send('Cannot find user');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('success');
        } else {
            res.send('failed');
        }
    } catch {
        res.status(500)
    }
});

app.listen(8080);
