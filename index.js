const express = require('express');
const dotenv = require('dotenv');
const auth = require('./auth/index.js');



dotenv.config();

const app = express();

app.use(express.json())

app.use(auth.router)







app.listen(process.env.PORT,()=>{
    console.log(`Server started`)
})