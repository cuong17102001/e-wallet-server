import UserModel from "../Models/UserModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass

    const newUser = new UserModel(req.body)

    const {username} = req.body

    try {

        const oldUser = await UserModel.findOne({username})

        if (oldUser) {
            return res.status(400).json({message : "Username already register!"})
        }

        const user = await newUser.save();
        const token = jwt.sign({
            username : user.username,
            id : user._id
        }, process.env.JWT_KEY , {expiresIn:"1h"})
        res.status(200).json({user , token})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username: username })

    try {
        if (user) {
            const validity = await bcrypt.compare(password, user.password)

            if (!validity) {
                res.status(400).json({message : "wrong password"})
            }else{
                const token = jwt.sign({
                    username : user.username,
                    id : user._id
                }, process.env.JWT_KEY)

                res.status(200).json({user , token})
            }
        }
        else{
            res.status(400).json({message : "users not exists"})
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}