import mongoose = require("mongoose");

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

const UserModel = mongoose.model('users', userSchema);
const ContentModel = mongoose.model('content', contentSchema);
const TagModel = mongoose.model('tags', tagSchema);
const LinkModel = mongoose.model('link', linkSchema);

module.exports = {
    UserModel: UserModel,
    ContentModel: ContentModel,
    TagModel: TagModel,
    LinkModel: LinkModel,
};