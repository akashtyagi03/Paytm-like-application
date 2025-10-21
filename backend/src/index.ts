import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import z, { string } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import { authMiddleware } from "./middleware";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.post("/api/v1/signup", async (req: Request, res: Response) => {
    try {
        const zodSchema = z.object({
            firstName: z.string().min(2, "First name must be at least 2 characters long").max(30, "First name can't be longer than 30 characters").trim(),
            lastName: z.string().min(2, "Last name must be at least 2 characters long").max(30, "Last name can't be longer than 30 characters").trim(),
            email: z.email("Please enter a valid email address").trim(),
            password: z
                .string()
                .min(4, "Password must be at least 8 characters long")
                .max(32, "Password can't be longer than 32 characters")
                .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
                .regex(/[a-z]/, "Password must contain at least one lowercase letter")
                .regex(/[0-9]/, "Password must contain at least one number")
                .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),
        });
        const parsedData = zodSchema.safeParse(req.body);
        if (!parsedData.success) {
            console.log("error is", parsedData.error)
            return res.json({
                message: "Invalid data"
            })
        }

        try {
            const { firstName, lastName, email, password } = req.body;
            const hasedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: hasedPassword
                }
            });
            const token = jwt.sign({ userId: user.id }, typeof process.env.JWT_SECRET);
            if (user) {
                return res.status(201).json({
                    message: "User created successfully",
                    user,
                    token
                });
            }
        } catch (error) {
            console.log("err is", error)
            return res.status(500).json({
                message: "Error creating user"
            });
        }

    } catch (error) {
        console.log("err is", error)
        res.status(500).send("Internal Server Error");
    }
})

app.post("/api/v1/login", async (req: Request, res: Response) => {
    try {
        const zodSchema = z.object({
            email: z.email("Please enter a valid email address").trim(),
            password: z
                .string()
                .min(4, "Password must be at least 8 characters long")
                .max(32, "Password can't be longer than 32 characters")
                .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
                .regex(/[a-z]/, "Password must contain at least one lowercase letter")
                .regex(/[0-9]/, "Password must contain at least one number")
                .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),
        });
        const parsedData = zodSchema.safeParse(req.body);
        if (!parsedData.success) {
            console.log("error is", parsedData.error)
            return res.json({
                message: "Invalid data"
            })
        }

        try {
            const { email, password } = req.body;
            type usertype = {
                id?: number,
                email?: String,
                password?: String
            } | null

            const user: usertype = await prisma.user.findFirst({
                where: { email },
                select: { id: true, email: true }
            });
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const isvalidate = bcrypt.compare(password, user.password as string);
            if (!isvalidate) {
                return res.status(401).json({
                    message: "Invalid password"
                });
            }

            const token = jwt.sign({ userId: user.id }, typeof process.env.JWT_SECRET);
            if (user) {
                return res.status(201).json({
                    message: "User login successfully",
                    user,
                    token
                });
            }
        } catch (error) {
            console.log("err is", error)
            return res.status(500).json({
                message: "Error creating user"
            });
        }
    } catch (error) {
        console.log("err is", error)
        res.status(500).send("Internal Server Error");
    }
})

// end point to update user crendential
app.put("/api/v1/update-profile", authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId: any = req.userId;
        const { firstName, lastName } = req.body;
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName,
                lastName
            }
        });
        return res.status(200).json({
            message: "User profile updated successfully",
            updatedUser
        });
    } catch (error) {
        console.log("err is", error)
        res.status(500).send("Internal Server Error");
    }
})

app.get("/api/v1/bulk", authMiddleware, async (req: Request, res: Response) => {
    try {
        const filter = req.query.filter as string | " ";

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        firstName: {
                            contains: filter,
                        }
                    },
                    {
                        lastName: {
                            contains: filter,
                        }
                    }
                ]
            },
            select: {
                id: true,
                firstName: true,
                lastName: true
            }
        });
        
        return res.status(200).json({
            message: "Users fetched successfully",
            users
        });
    } catch (error) {
        console.log("err is", error)
        res.status(500).send("Internal Server Error");
    }
})

app.listen(process.env.PORT || 5000);