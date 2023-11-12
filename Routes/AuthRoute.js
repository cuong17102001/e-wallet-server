import express from 'express';
import { loginUser, registerUser } from '../Controllers/AuthController.js';
import { verifyToken } from '../Middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/register' , registerUser)
router.post('/login' , loginUser)

router.get("/" , (req , res)=>{
     res.json("123123123")
})


export default router