import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {UserModel,ContentModel} from "./db.js";
import {userMiddleware} from "./middleware.js";

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
        contentId,
        userId: userId
    });
    res.json({message: "All content deleted"});
});

app.post("/api/v1/brain/share", (req, res) => {
    res.json({ message: "Share brain" });
});

app.get("/api/v1/brain/:sharedLink", (req, res) => {
    const { sharedLink } = req.params;
    res.json({ message: `Shared link: ${sharedLink}` });
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

