import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        fullname: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        profilePicture : String,
        about : String,
        money : {
            type : Number,
            default : 123123.12312
        }
    },{
        timestamps : true
    }
)

const UserModel = mongoose.model('Users' , UserSchema)

export default UserModel

