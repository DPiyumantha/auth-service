const express = require('express');
const authService = require('./auth.service');

const authRouter = express.Router();


authRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    authService.login(username, password).then(data => {
        res.status(200).json(data)
    }).catch(error => {
        console.log(error)
        res.sendStatus(404)
    })
})

authRouter.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const response = await authService.register(username, password);
        res.status(201).json(response)
    } catch (error) {
        res.sendStatus(500)
    }
})

authRouter.post('/testtoken', (req, res) => {
    if (!req.headers.authorization) res.sendStatus(401)
    try {
        const token = req.headers.authorization
        const payload = authService.testToken(token)
        res.status(200).json(payload)
    } catch (error) {
        res.sendStatus(403)
    }
})

module.exports = authRouter;