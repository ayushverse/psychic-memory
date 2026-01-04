import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./db.js";

const app = express();
app.use(express.json());

app.post("/api/v1/signin", (req, res) => {
    res.json({ message: "Signin route" });
});

app.post("/api/v1/content", (req, res) => {
    res.json({ message: "Create content" });
});

app.get("/api/v1/content", (req, res) => {
    res.json({ message: "Get content" });
});

app.delete("/api/v1/content", (req, res) => {
    res.json({ message: "Delete content" });
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

