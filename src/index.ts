import express = require("express");
import mongoose = require("mongoose");
import jwt = require("jsonwebtoken");
import z = require("zod");
import bcrypt = require("bcrypt");
import { ContentModel, TagModel, UserModel } from "./db";
import { Auth } from "./middleware";
import { JWT_USER_PASSWORD } from "./config";
import { MONGO_URL } from "./config";

const app = express();
app.use(express.json());


app.post("/api/v1/signup", async (req, res)=>{

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
                id: user._id.toString() 
            }, JWT_USER_PASSWORD);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // use secure in production for https
                maxAge: 1000 * 60 * 60,
                sameSite: 'lax', // protects against CSRF
            })

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

app.post("/api/v1/content", Auth, async (req, res)=>{

    const contentBody = z.object({
        link: z.string().url(),
        type: z.enum(['image', 'video', 'article', 'audio']),
        title: z.string().min(1),
        tags: z.array(z.string()).optional().default([]),
    })

    const parsedData = contentBody.safeParse(req.body);

    if(!parsedData.success){
        return res.status(400).json({
            msg: "Invalid input format",
            error: parsedData.error.flatten()
        });
    }

    const { link, type, tags, title } = parsedData.data;

    try{

        const tagIds = await Promise.all(
            tags.map(async(tagTitle)=>{
                const formattedTitle = tagTitle.trim().toLowerCase();

                let tag = await TagModel.findOne({ title: formattedTitle });

                if(!tag){
                    tag = await TagModel.create({ title: formattedTitle })
                }

                return tag._id;
            })
        )

        const newContent = await ContentModel.create({
            link: link,
            type: type,
            title: title,
            tags: tagIds,
            userId: req.userId  // this we got from the auth middleware
        })

        return res.status(201).json({
            msg: "Content created successfully",
            content: newContent,

        })

    }catch(e){

        console.error("Error creating content: ", e);
        return res.status(500).json({
            msg: "An internal server error occured",
        });

    }
});

app.get("/api/v1/content", Auth, async (req, res)=>{

    const userId = req.userId;

    try{

        const content = await ContentModel.find({
            userId: userId
        })
        .populate("userId", "email")
        .populate("tags", "title")

        return res.status(200).json({
            content
        })

    }catch(e){

        return res.status(403).json({
            msg: "Failed to get the contents"
        })

    }
});

app.delete("/api/v1/content", async (req, res)=>{
    const userId = req.userId;

    try{
        
        const deleteContent = await ContentModel.deleteOne({userId: userId});

        if(deleteContent){
            return res.status(201).json({
                msg: "Note Successfully Deleted",
            });
        }else{
            throw new Error("There was an error while deleting the note");
        }

    }catch(e){

        return res.status(404).json({
            msg: "Internal server error"
        });

    }
});

app.post("api/v1/brain/share", async (req, res)=>{

});

app.get("api/v1/brain/:shareLink", async (req, res)=>{

});

const main = async () => {
    if (!MONGO_URL) {
        console.error("FATAL ERROR: MONGO_URL is not defined in environment variables.");
        process.exit(1);
    }

    try{
        await mongoose.connect(MONGO_URL);
        app.listen(3000);
    }catch(e){
        console.log("Error connecting to DB");
    }
};

main();