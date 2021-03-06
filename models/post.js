const mongoose = require('mongoose');
const _ = require('lodash')


const PostSchema = new mongoose.Schema({
    // user: {
    //     type: mongoose.ObjectId,
    //     ref: 'User'
    // },
    title: {
        type: String,
        required: true,
        min: 10,
        max: 20
    },
    body: {
        type: String,
        required: true,
        min: 10,
        max: 500
    },
    tags:
    {
        type: [String],
        required: false,
        maxlength: 20

    }

}, {
    toJSON: {
        virtuals: true,
        transform: doc => {
            return _.pick(doc, ["title", "body", "tags", "user", "createdAt", "updatedAt"])
        }
    }
})


//m3a el populate
// PostSchema.virtual('user',
//     {
//         ref: 'User',
//         localField: 'userId',
//         //m3a el ref ele fl posts
//         foreignField: '_id'
//     })
const Post = mongoose.model('Post', PostSchema);
module.exports = Post;