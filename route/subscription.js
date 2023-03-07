import express from "express";
import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { expressjwt } from "express-jwt";
import createError from 'http-errors';
import {fetchAPI} from '../js/fetchAPI.js'
import { getPainting } from "../js/queries.js";
import * as dotenv from 'dotenv'

dotenv.config()

const router = express.Router()
const prisma = new PrismaClient();


const auth = expressjwt({
    secret: process.env["JWT_KEY"],
    algorithms: ["HS256"],
  }); 

  router.get('/subscription/:uuid', auth, async (req, res, next)=>{
    const {uuid} = req.params
    try{
        const data = await fetchAPI(getPainting(uuid), process.env.API_AUTH_TOKEN)
       console.log(data)
        const AuteurObject = {
        "Name" : data[0].fieldOeuvreAuteurs[0].entity.fieldAuteurAuteur.entity.name,
        "Born_date" : data[0].fieldOeuvreAuteurs[0].entity.fieldAuteurAuteur.entity.fieldPipDateNaissance.processed,
        "Dead_date" : data[0].fieldOeuvreAuteurs[0].entity.fieldAuteurAuteur.entity.fieldPipDateDeces.processed,
      }
      const PeintureObject = {
        "Title" : data[0].title, 
        "Picture" : data[0].fieldVisuels[0].entity.publicUrl
      }
        console.log(AuteurObject)
        console.log(PeintureObject)
        res.json(data)
    }catch(error){
        next(error)
    }
    
  })


  export default router