import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { string } from "zod";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers[`authorization`] || req.headers[`Authorization`] as string;
        if (!authHeader) {
            return res.status(401).json({ error: "Authorization header missing" });
        } 

        const token = authHeader.split(" ")[1]; 
        if (!token) {
            return res.status(401).json({ error: "Token missing" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.userId = decoded.userId;
        next()
    }catch(err){
        console.error('Authentication error:', err);
        return res.status(401).json({ error: "Invalid token" });
    }
}