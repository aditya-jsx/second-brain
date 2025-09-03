import express = require("express");
import mongoose = require("mongoose");
import jwt = require("jsonwebtoken");
import z = require("zod");
import bcrypt = require("bcrypt");
import { ContentModel, LinkModel, TagModel, UserModel } from "./db";
import { Auth } from "./middleware";
import { BASE_URL, JWT_USER_PASSWORD } from "./config";
import { MONGO_URL } from "./config";
const crypto = require('crypto');
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());


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
                userId: user._id.toString() 
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

app.delete("/api/v1/content/:contentId", Auth,  async (req, res)=>{

    const { contentId } = req.params
    const userId = req.userId;

    if (!contentId) {
        return res.status(400).json({ msg: "Content ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return res.status(400).json({ msg: "Invalid content ID format" });
    }

    try{
        
        const deleteContent = await ContentModel.deleteOne({ 
            _id: contentId,
            userId: userId
         });

        if(deleteContent.deletedCount === 0){
            return res.status(404).json({
                msg: "Content not found or you do not have permission to delete this note",
            });
        }

        return res.status(200).json({
            msg: "Content deleted Successfully"
        })

    }catch(e){

        console.error("Error during content deletion: ", e)
        return res.status(500).json({
            msg: "An internal server error occurred"
        });

    }
});

app.post("/api/v1/brain/share", Auth, async (req, res)=>{
    const userId = req.userId;

    try{
        const existinLink = await LinkModel.findOne({ userId: userId })

        if(!existinLink){

            const hash = crypto.randomBytes(20).toString('hex');

            const newShareableLink = `${req.protocol}://${req.get('host')}/api/v1/brain/${hash}`

            const newHash = await LinkModel.create({
                userId: userId,
                hash: hash
            })

            return res.status(201).json({
                link: newShareableLink
            })
        }

        const shareableLink = `${req.protocol}://${req.get('host')}/api/v1/brain/${existinLink.hash}`

        return res.status(200).json({
            msg: "Existing shareable link retrieved",
            link: shareableLink
        })

    }catch(e){
        console.error("Error generating shareable link:", e);
        return res.status(500).json({
            msg: "Error generating a link"
        })
    }
});

app.get("/api/v1/brain/:shareLink", async (req, res)=>{

    const { shareLink } = req.params;

    try{

        let linkDocument = await LinkModel.findOne({ hash: shareLink });

        if(!linkDocument){
            return res.status(404).json({
                msg: "Share link not found or invalid"
            });
        }

        const userId = linkDocument.userId;

        let contents = await ContentModel.find({ userId: userId })
         .populate('tags', 'title');

        return res.status(200).json({
            content : contents
        });

    }catch(e){

        console.error("Error fetching shared contents", e);
        return res.status(500).json({
            msg: "An internal server error occured"
        });

    }
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