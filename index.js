import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import AuthRoute from './Routes/AuthRoute.js'
import UserRoute from './Routes/UserRoute.js'
import PostRoute from './Routes/PostRoute.js'
import UploadRoute from './Routes/UploadRoute.js'
import ChatRoute from "./Routes/ChatRoute.js"
import MessageRoute from "./Routes/MessageRoute.js"
import cors from 'cors'


//route

const app = express();

//public folder images
app.use(express.static('public'))
app.use('/images' , express.static('images'))

app.set('view engine', 'ejs');

//middleware
app.use(bodyParser.json({limit: '30mb' , extended: true}))
app.use(bodyParser.urlencoded({limit: '30mb' , extended: true}))
app.use(cors())

dotenv.config();

await mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true, // Boilerplate for Mongoose 5.x,
    useUnifiedTopology: true
})
.then(()=> app.listen(process.env.PORT , ()=> console.log("listening at", process.env.PORT)))
.catch((err) => console.log(err));
console.log(mongoose.connection.readyState);
console.log("heyo what's up!!");

app.use('/auth' , AuthRoute);
app.use('/user' , UserRoute);
app.use('/post' , PostRoute);
app.use('/upload', UploadRoute);
app.use('/chat', ChatRoute);
app.use('/message', MessageRoute);