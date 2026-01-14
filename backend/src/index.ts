import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB, {LinkModel} from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {UserModel,ContentModel} from "./db.js";
import {userMiddleware} from "./middleware.js";
import * as crypto from 'crypto';


const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
    const{username,password} = req.body;
    const user = await UserModel.findOne({username});
    if(user){
        return  res.status(400).json({message: "Username already exists"});
    }
    const newUser = new UserModel({
        username,
        password
    })
    newUser.password = await bcrypt.hash(password,10);
    await newUser.save();
    res.status(201).json({message: "User created successfully"});
});

app.post("/api/v1/login", async (req, res) => {
    const{username,password} = req.body;
    const user = await UserModel.findOne({username});
    if(!user){
        return res.status(400).json({message: "Invalid username or password"});
    }else{
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid username or password"});
        }else{
            const token = jwt.sign(
                {userId: user._id, username: user.username},
                process.env.JWT_SECRET || "defaultsecret",
                {expiresIn: "24h"}
            );
            return res.status(200).json({token , message : "Logged In"});
        }
    }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const{title, link, type} = req.body;
    await ContentModel.create({
        title,
        link,
        type,
        //@ts-ignore
        userId: req.userId,
        tags : []
    })
    res.json({message:"Successfully created"});
});

app.get("/api/v1/content",userMiddleware , async (req, res) => {
    //@ts-ignore
    const userId = req.userId
    const content = await ContentModel.find({
        userId: userId
    }).lean();
    res.json({content});
});

app.delete("/api/v1/content", userMiddleware , async (req, res) => {
    //@ts-ignore
    const userId = req.userId
    const contentId = req.body.id;
    await ContentModel.deleteMany({
        _id:contentId,
        userId
    });
    res.json({message: "All content deleted"});
});

app.post("/api/v1/brain/share",userMiddleware , async(req, res) => {
    //@ts-ignore
    const userId = req.userId
    const {share} = req.body

    if(share === false){
        await LinkModel.deleteOne({userId})
        return res.json({message: "Sharing disabled"});
    }

    let existingLink = await LinkModel.findOne({userId})
    if(existingLink){
        return res.json({
            link: `${req.protocol}://${req.get("host")}/api/v1/brain/${existingLink.hash}`
        })
    }

    const hash = crypto.randomBytes(10).toString("hex");
    await LinkModel.create({
        hash,
        userId
    })
    res.json({
        link: `${req.protocol}://${req.get("host")}/api/v1/brain/${hash}`,
    })
});

app.get("/api/v1/brain/:sharedLink", async(req, res) => {
    const hash = req.params.sharedLink

    const link = await LinkModel.findOne({hash})
    if(!link){
        return res.status(404).json({message: "Link not found"})
    }
    const content = await ContentModel.find({
        userId: link.userId
    }).lean()
    res.json({content})
});

const PORT = process.env.PORT || 5761;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to start server:", err);
    });

