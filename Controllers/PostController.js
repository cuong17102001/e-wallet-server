import mongoose from 'mongoose'
import PostModel from '../Models/PostModel.js'
import UserModel from '../Models/UserModel.js'

export const createPost = async (req, res) => {
    const newPost = new PostModel(req.body)

    try {
        await newPost.save()
        res.status(200).json(newPost)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getPost = async (req, res) => {
    const id = req.params.id

    try {
        const post = await PostModel.findById(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updatePost = async (req, res) => {
    const postId = req.params.id
    const { userId } = req.body

    try {
        const post = await PostModel.findById(postId)
        if (post.userId === userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json({ message: "post updated!" })
        } else {
            res.status(403).json({ message: "action forbiden" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deletePost = async (req, res) => {
    const postId = req.params.id
    const { userId } = req.body

    try {
        const post = await PostModel.findById(postId)
        if (post.userId === userId) {
            await post.deleteOne()
            res.status(200).json({ message: "post deleted!" })
        } else {
            res.status(403).json({ message: "action forbiden" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getTimelinePosts = async (req , res) =>{
    const userId = req.params.id

    try {
        const currentUserPosts = await PostModel.find({userId : userId})
        const followingPosts = await UserModel.aggregate([
            {
                $match : {
                    _id : new mongoose.Types.ObjectId(userId)
                }
                
            },
            {
                $lookup:{
                    from : "posts",
                    localField : "following",
                    foreignField: "userId",
                    as: "followingPosts"
                }
            },{
                $project: {
                    followingPosts : 1,
                    _id : 0
                }
            }
        ])
        res.status(200).json(currentUserPosts.concat(followingPosts))
    } catch (error) {
        res.status(500).json(error)
    }
}

export const likePost = async (req , res) =>{
    const id = req.params.id
    const {userId} = req.body

    try {
        const post = await PostModel.findById(id)
        if (!post.likes.includes(userId)) {
            await post.updateOne({$push : {likes : userId}})
            res.status(200).json({message : "Post liked"})
        }else{
            await post.updateOne({$pull : {likes : userId}})
            res.status(200).json({message : "Post unliked"})
        }
    } catch (error) {
        res.status(500).json(error)
    }

}

export const commentPosts = async(req , res) =>{
    const id = req.params.id
    const {idUserComment , nameUser , content} = req.body

    const comment = {
        idUserComment,
        nameUser,
        content
    }

    try {
        const post = await PostModel.findById(id)
        await post.updateOne({$push : {comment : comment}})
        res.status(200).json({message : "Comment success"})
    } catch (error) {
        res.status(500).json(error)
    }
}