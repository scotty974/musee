import express from "express";
import login from '../MuseeBack/route/login.js'; 
import register from './route/register.js'
import cors from 'cors';
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const port = 3000

app.use('/', register)
app.use('/', login) 
 



// run the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);     
});