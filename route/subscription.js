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
        let authorName  = data[0].fieldOeuvreAuteurs[0].entity.fieldAuteurAuteur.entity.name
        const strName = authorName.split(', ')
        authorName = strName[1] + " " + strName[0]
        const AuteurObject = await prisma.artists.create({
          
        data:{
        Name : authorName,
        Born_Date : data[0].fieldOeuvreAuteurs[0].entity.fieldAuteurAuteur.entity.fieldPipDateNaissance.processed,
        Dead_Date : data[0].fieldOeuvreAuteurs[0].entity.fieldAuteurAuteur.entity.fieldPipDateDeces.processed,
        Painting : {connect:{uuId :data[0].entityUuid}}
        
        }
        
        
      })
      console.log(authorName)
        res.json({message : "Data sended"})
        
    }catch(error){
        next(error)
    }
    
  })


  router.get('/artists', async (req,res,next)=>{
    try {
      const games = await prisma.artists.findMany({
         
        
      });
      res.json(games);
    } catch (error) {
      return res.status(400).json({ errors: error.issues });
    }
   
  })

  router.get('/artists/:id', async (req,res,next)=>{
    const id = parseInt(req.params.id)
    try {
     
      const games = await prisma.artists.findFirst({
        where:{
          id : id
        }
      });
      res.json(games);
    } catch (error) {
      return res.status(404).json({ errors: error.issues });
    }
   
  })
  router.get('/artists/:id/paints', async (req,res,next)=>{
    const id = parseInt(req.params.id)
    try {
     
      const games = await prisma.artists.findFirst({
        where:{
          id : id
        },
        include:{
          Painting : true
        }
      });
      res.json(games);
    } catch (error) {
      return res.status(404).json({ errors: error.issues });
    }
   
  })
 
  router.get('/random', async (req, res, next)=>{
    try{
      
      const game = await prisma.artists.findMany({
        skip :5, 
        take:4, 
        orderBy:{
          id : "asc"
        }
      })
      res.json(game);
    }catch(error){
      next(error)
    }
  })
  router.get('/artists/:id/paints/random', async (req, res, next)=>{
     const id = parseInt(req.params.id)
    try {
     
      const artists = await prisma.artists.findMany({
        take:1,
        where:{
          id : id
        },
        include:{
          Painting : true
        }
      });
      res.json(artists);
    } catch (error) {
      return res.status(404).json({ errors: error.issues });
    }
  })


  export default router