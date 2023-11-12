import UserModel from "../Models/UserModel.js";
import bcrypt from 'bcrypt'

export const getUser = async(req , res)=>{
    const id = req.params.id

    try {
        const user = await UserModel.findById(id)

        if (user) {
            const {password , ...otherDetails} = user._doc

            res.status(200).json(otherDetails)
        }
        else{
            res.status(400).json({message : "user not exist"})
        }
    } catch (error) {
        res.status(500).json({message : error.message})
    }
}

export const updateUser = async(req , res)=>{
    const id = req.params.id
    const {currentUserId , currentUserAdminStatus , password} = req.body

    if (password) {
        const salt = bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(password , parseInt(salt)) 
    }

    if (id === currentUserId || currentUserAdminStatus) {
        try {
            const user = await UserModel.findByIdAndUpdate(id , req.body , {new: true})
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({message : error.message})
        }
    }else{
        res.status(400).json({message : "user not exist"})
    }
}

export const deleteUser = async(req , res) =>{
    const id = req.params.id

    const {currentUserId , currentUserAdminStatus} = req.body

    if (id === currentUserId || currentUserAdminStatus) {
        try {
            await UserModel.findByIdAndDelete(id)
            res.status(200).json({message : "delete user successfully"})
        } catch (error) {
            res.status(500).json({message : error.message})
        }
    }else{
        res.status(403).json({message : "access denied!"})
    }
}

export const followUser = async(req , res)=>{
    const id = req.params.id

    const {currentUserId} = req.body

    if(currentUserId === id){
        res.status(403).json({message: "action forbiden"})
    }else{
        try {
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)

            if (!followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({$push : {followers : currentUserId}})
                await followingUser.updateOne({$push : {following : id}})
                res.status(200).json({message:"user followed!"})
            }
            else{
                res.status(403).json({message :"user is already followed by you"})
            }
        } catch (error) {
            res.status(500).json({message : error.message})
        }
    }
}


export const unFollowUser = async(req , res)=>{
    const id = req.params.id

    const {currentUserId} = req.body

    if(currentUserId === id){
        res.status(403).json({message: "action forbiden"})
    }else{
        try {
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)

            if (followUser.followers.includes(currentUserId)) {
                await followUser.updateOne({$pull : {followers : currentUserId}})
                await followingUser.updateOne({$pull : {following : id}})
                res.status(200).json({message:"user unfollowed!"})
            }
            else{
                res.status(403).json({message :"user is not followed by you"})
            }
        } catch (error) {
            res.status(500).json({message : error.message})
        }
    }
}

export const getAllUser = async(req , res)=>{
    const id = req.params.id
    try {
        let users = await UserModel.find({ "_id": { $ne: id } })
        users = users.map((user) =>{
            const {password , ...otherDetails} = user._doc
            return otherDetails
        })
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
}