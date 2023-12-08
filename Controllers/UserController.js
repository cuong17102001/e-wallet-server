import UserModel from "../Models/UserModel.js";
import bcrypt from 'bcrypt'
import HistoryModel from "../Models/History.js";

export const chuyentien = async(req , res) =>{
    const sendId = req.body.sendId
    const reciverId = req.body.reciverId
    const sotien = req.body.sotien
    
    const thongtinnguoigui = await UserModel.findById(sendId)
    const thongtinnguoinhan = await UserModel.findById(reciverId)

    if (thongtinnguoigui.money < sotien) {
        return res.status(400).json({message : "không đủ tiền"})
    }

    thongtinnguoigui.money = thongtinnguoigui.money - sotien
    thongtinnguoinhan.money = thongtinnguoinhan.money + sotien

    const addHistorygui = new HistoryModel({
        userId : sendId,
        service : "Chuyển Tiền",
        money : sotien,
        sodu : thongtinnguoigui.money - sotien,
        reciverId : reciverId
    }) 

    const addHistorynhan = new HistoryModel({
        userId : reciverId,
        service : "Chuyển Tiền",
        money : sotien,
        sodu : thongtinnguoigui.money - sotien,
        reciverId : sendId
    }) 
    await addHistorygui.save()
    await addHistorynhan.save()
    await thongtinnguoigui.updateOne({$set: thongtinnguoigui})
    await thongtinnguoinhan.updateOne({$set: thongtinnguoinhan})

    res.status(200).json({message : "thành công"})
}

export const postNapTien = async(req , res)=>{
    const sotien = req.body.sotien;
    const userid = req.params.id

    const user = await UserModel.findById(userid)
    

    const addHistory = new HistoryModel({
        userId : userid,
        service : "Nạp tiền",
        money : sotien,
        sodu : user.money + sotien
    }) 
    await addHistory.save()
    user.money = user.money + sotien

    await user.updateOne({$set: user})

    res.status(200).json(user)
}

export const postRutTien = async(req , res)=>{
    const sotien = req.body.sotien;
    const userid = req.params.id

    const user = await UserModel.findById(userid)
    
    if (sotien > user.money) {
       return res.status(400).json({message : "không đủ tiền"})
    }

    const addHistory = new HistoryModel({
        userId : userid,
        service : "Rút tiền",
        money : sotien,
        sodu : user.money - sotien
    }) 
    await addHistory.save()
    user.money = user.money - sotien

    await user.updateOne({$set: user})

    res.status(200).json(user)
}

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