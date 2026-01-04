import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string;
}

export const userMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({ message: "JWT secret not configured" });
        }

        const decoded = jwt.verify(token, secret) as JwtPayload;
        //@ts-ignore
        req.userId = decoded.userId;

        next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
