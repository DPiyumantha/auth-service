const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../database/index')


const users = [];
const refreshTokens = []
async function login(username, password) {

    const userDb = await db.databaseService.getUserByUsername(String(username).toLowerCase())
    if (!userDb[0]) throw Error('Not found')
    const result = await bcrypt.compare(password, userDb[0].encryptedpassword)
    if (result == true) {
        return generateTokens(username);
    }
    throw Error('Unauthorized')
}

function generateTokens(username) {

    const accessToken = generateAccessToken(username)
    const refreshToken = generateRefreshToken(username)
    refreshTokens.push(refreshToken)
    return {
        accessToken,
        refreshToken
    }
}

function refreshToken(token) {
    if (refreshTokens.includes(token)) {
        throw Error('Not found')
    }
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    return generateAccessToken(username)
}

function logout() {

}

async function register(username, password) {

    const hashedPassword = await bcrypt.hash(password, +process.env.SALT_ROUNDS)
    console.log(hashedPassword)
    users.push({ username, hashedPassword })
    return db.databaseService.insertUser({ username: String(username).toLowerCase(), password: hashedPassword })
}

function generateAccessToken(username) {
    return jwt.sign({ username: String(username).toLowerCase() }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

function generateRefreshToken(username) {
    return jwt.sign({ username: String(username).toLowerCase() }, process.env.REFRESH_TOKEN_SECRET)
}

function testToken(token) {
    const tokenExtract = token.split(' ')[1]
    const payload = jwt.verify(tokenExtract, process.env.ACCESS_TOKEN_SECRET)
    console.log(payload)
    return payload
}

module.exports = {
    register,
    login,
    logout,
    generateAccessToken,
    generateRefreshToken,
    testToken
}