import express from "express";
import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { expressjwt } from "express-jwt";
import createError from 'http-errors';
import registerValidation from "../validators/userValidator.js";

const router = express.Router()
const prisma = new PrismaClient();

const auth = expressjwt({
    secret: process.env["JWT_KEY"],
    algorithms: ["HS256"],
  }); 
// route pour créée un compte 
router.post('/register',async (req,res,next)=>{
    let logindata;
    try{
        logindata = registerValidation.parse(req.body)
    }catch(error){
        return res.status(400).json({ errors: error.issues })
    }
// on va d'abord verifier la présence de l'adresse mail
    const user = await prisma.user.findFirst({
        where:{
            Email : logindata.email
        }
    })  
    // on vérifie si un compte n'existe pas déjà 
    if(user) return next(createError(400, "Un compte existe déjà avec cet email."))
    // on va hasher le mot de passe poru plus de sécurité 
    const hashedPassword = await bcrypt.hash(logindata.password, 10)

    await prisma.user.create({
        data:{
            Email:logindata.email,
            Password : hashedPassword,
            
        }
    }).then((user)=>{

    
        res.json({
            token: jwt.sign(
                {
                    Email : user.email,
                   
                },
                process.env["JWT_KEY"],
                {
                    expiresIn: "30min",
                }
            )
        })
    })
})


export default router;