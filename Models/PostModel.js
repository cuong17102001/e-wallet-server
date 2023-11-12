import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        desc: {
            type: String
        },
        likes : [],
        image: {
            type: String
        },
        comment: []
    },{
        timestamps : true
    }
)

const PostModel = mongoose.model('Posts' , PostSchema)

export default PostModel

