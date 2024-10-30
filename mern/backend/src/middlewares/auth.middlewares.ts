import UserModel from "@/models/user.model";
import { formatUserProfile, sendErrorResponse } from "@/utils/helper.utils";
import { RequestHandler } from "express";
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        export interface Request {
            user: {
                id: string;
                name?: string | null;
                email: string;
                role: "user" | "author";
                avatar?: string;
                signedUp: boolean;
                authorId?: string
            }
        }
    }
}

export const isAuth: RequestHandler = async (req, res, next) => {
    const authToken = req.cookies.authToken;

    if(!authToken){
        return sendErrorResponse({
            message: 'Unauthorized request!',
            status: 401,
            res
        })
    }

    const payload = jwt.verify(authToken, process.env.JWT_SECRET!) as {
        userId: string;
    };

    const user = await UserModel.findById(payload.userId);
    if(!user){
        return sendErrorResponse({
            message: "Request User not Found!",
            status: 401,
            res
        })
    }

    req.user = formatUserProfile(user);
    next()
};


export const isAuthor: RequestHandler = async(req, res, next) => {
    if (req.user.role === 'author') next();
    else sendErrorResponse({message:"Invalid Request! User is not an author yet", res, status:401});
}
