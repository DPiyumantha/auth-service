const postgres = require('postgres');
const dotenv = require('dotenv')
dotenv.config()


const connection = postgres({
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD
})

function createUser() {
    connection`
    `
}

async function insertUser({ username, password, firstname, lastname }) {
    const users = await connection`
      insert into credentials
        (username, encryptedpassword)
      values
        (${username}, ${password})
      returning username
    `
    // users = Result [{ name: "Murray", age: 68 }]
    return users
}


async function getUserByUsername(username) {
    const name = String(username).toLowerCase()
    const result = await connection`
    select * from credentials where username =${name}`
    return result
}

module.exports = {
    insertUser,
    getUserByUsername
}