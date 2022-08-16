import { jwtKey } from './../constant/constant';
import express, { Router,Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as EmailValidator from "email-validator";
import { stringify } from 'querystring';


const router:Router = Router();

function generateToken(user:string):string{
    return jwt.sign(user,jwtKey)
}


// route

router.post('/login', async(req:Request, res:Response) => {

    const {email,password} = req.body;

    console.log(email, password);

    if(!email || !password)
    {
        return res.status(400).send("Email and password are required. Please provide them");
    }
    if(!EmailValidator.validate(email))
    {
        return res.status(400).send("Please provide a valide email");
    }
    const user:string = stringify({email,password})
    const token:string = generateToken(user);
    res.send({token});
})

export const Auth:Router = router;




