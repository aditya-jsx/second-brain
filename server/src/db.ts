import mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique:true },
    password: { type: String, required: true },
});

const contentTypes = [ 'image', 'video', 'article', 'audio' ];

const contentSchema = new mongoose.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type:String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tags' }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
}, { timestamps: true });

const tagSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
});

const linkSchema = new mongoose.Schema({
    hash: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
}, { timestamps: true });

export const UserModel = mongoose.model('users', userSchema);
export const ContentModel = mongoose.model('content', contentSchema);
export const TagModel = mongoose.model('tags', tagSchema);
export const LinkModel = mongoose.model('link', linkSchema);