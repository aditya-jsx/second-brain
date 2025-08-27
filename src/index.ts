import express = require("express");
import mongoose = require("mongoose");
import jwt = require("jsonwebtoken");
import z = require("zod");
import bcrypt = require("bcrypt");
import { UserModel } from "./db";
import { JWT_USER_PASSWORD } from "./config";

const app = express();


app.post("/api/v1/signup", async (req, res)=>{
    // This route is already well-written. No changes needed here.
    const requiredBody = z.object({
        email: z.string().email(),
        password: z
         .string()
         .min(8, "Password must contain at least 8 characters")
         .regex(/[A-Z]/, "Must contain an uppercase character")
         .regex(/[a-z]/, "Must contain a lowercase character"),
    })

    const parsedData = requiredBody.safeParse(req.body);

    if(!parsedData.success){
        return res.status(400).json({
            msg: "Invalid Format",
            error: parsedData.error.flatten()
        })
    }

    const { email, password } = parsedData.data;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await UserModel.findOne({ email: email })
        if(existingUser){
            return res.status(400).json({
                msg: "User with this email already exists"
            })
        }

        await UserModel.create({
            email: email,
            password: hashedPassword
        })

        return res.status(200).json({
            msg: "Signup Completed"
        })

    }catch(e){
        console.error("Database error occured during signup", e);
        if (e instanceof Error) {
        return res.status(500).json({
            msg: "An unexpected error occurred during signup",
            error: e.message 
        })
        }else{
        return res.status(500).json({
            msg: "An unexpected and unknown error occurred",
            error: String(e)
        });
        }
    }
});

app.post("/api/v1/signin", async (req, res)=>{

    const { email, password } = req.body;

    try{

        const user = await UserModel.findOne({email: email});
    
        if(!user){
            return res.status(403).json({
                msg: "Invalid email or password"
            })
        }
    
        const passwordMatch = await bcrypt.compare(password, user.password);

        if(passwordMatch){
            if (!JWT_USER_PASSWORD) {
                console.error("JWT secret is not configured.");
                return res.status(500).json({
                    msg: "Server configuration error."
                });
            }
            
            const token = jwt.sign({
                userId: user._id 
            }, JWT_USER_PASSWORD);

            return res.status(200).json({
                msg: "Sign in successful",
                token: token 
            });
        }else{
            return res.status(403).json({
                msg: "Invalid email or password"
            })
        }

    }catch(e){

        console.error("Error during signin:", e);
        if (e instanceof Error) {
            return res.status(500).json({
                msg: "An unexpected error occurred during signin",
                error: e.message
            });
        } else {
            return res.status(500).json({
                msg: "An unexpected and unknown error occurred",
                error: String(e)
            });

        }
    }

});

app.post("/api/v1/content", async (req, res)=>{

});

app.get("/api/v1/content", async (req, res)=>{

});

app.delete("/api/v1/content", async (req, res)=>{

});

app.post("api/v1/brain/share", async (req, res)=>{

});

app.get("api/v1/brain/:shareLink", async (req, res)=>{

});