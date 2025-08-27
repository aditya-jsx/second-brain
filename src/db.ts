import mongoose = require("mongoose");
import { MONGO_URL } from "./config";

const connectDB = async () => {

    if (!MONGO_URL) {
        console.error("FATAL ERROR: MONGO_URL is not defined in environment variables.");
        process.exit(1);
    }

    try{
        await mongoose.connect(MONGO_URL);
    }catch(e){
        console.log("Error connecting to DB");
    }

};

connectDB();

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique:true },
    password: { type: String, required: true },
});

const contentTypes = [ 'image', 'video', 'article', 'audio' ];

const contentSchema = new mongoose.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type:String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const tagSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
});

const linkSchema = new mongoose.Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
});

export const UserModel = mongoose.model('users', userSchema);
export const ContentModel = mongoose.model('content', contentSchema);
export const TagModel = mongoose.model('tags', tagSchema);
export const LinkModel = mongoose.model('link', linkSchema);