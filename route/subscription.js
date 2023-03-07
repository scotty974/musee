import express from "express";
import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { expressjwt } from "express-jwt";
import createError from 'http-errors';
import {fetchAPI} from '../js/fetchAPI.js'
import { getPainting } from "../js/queries.js";
import * as dotenv from 'dotenv'
import { object } from "zod";

dotenv.config()

const router = express.Router()
const prisma = new PrismaClient();


const auth = expressjwt({
    secret: process.env["JWT_KEY"],
    algorithms: ["HS256"],
  }); 

  router.post('/subscription/:uuid', auth, async (req, res, next)=>{
    const {uuid} = req.params
    try{
        const data = await fetchAPI(getPainting(uuid), process.env.API_AUTH_TOKEN)
      
        const PeintureObject = await prisma.painting.create({
        data:{
          uuId :data[0].entityUuid,
          Name : data[0].title, 
          Image_url : data[0].fieldVisuels[0].entity.publicUrl
        }
        
      })
        const AuteurObject = await prisma.artists.create({
        data:{
        Name: data[0].fieldOeuvreAuteurs[0].entity.fieldAuteurAuteur.entity.name,
        Born_Date : data[0].fieldOeuvreAuteurs[0].entity.fieldAuteurAuteur.entity.fieldPipDateNaissance.processed,
        Dead_Date : data[0].fieldOeuvreAuteurs[0].entity.fieldAuteurAuteur.entity.fieldPipDateDeces.processed,
        Painting : {connect : {uuId : data[0].entityUuid}}
        
        }
        
        
      })
      
        res.json({message : "Projet de merde mais bien vu ca marche quand meme"})
        
    }catch(error){
        next(error)
    }
    
  })

  


  export default router