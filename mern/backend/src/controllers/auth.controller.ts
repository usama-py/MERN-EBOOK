
import { RequestHandler } from "express";
import crypto from "crypto";
import VerificationTokenModel from "@/models/verificationToken.model";
import UserModel from "@/models/user.model";
import mail from "@/utils/mail.utils";
import { formatUserProfile, sendErrorResponse } from "@/utils/helper.utils";
import jwt from 'jsonwebtoken';
import { profile } from "console";


export const generateAuthLink:RequestHandler = async (req, res) => {
    const {email} = req.body;
    let user = await UserModel.findOne({email});

    if(!user){
        user = await UserModel.create({
            email
        })
    }
    const userId = user._id.toString();
    await VerificationTokenModel.findOneAndDelete({userId})
    const randomToken = crypto.randomBytes(36).toString("hex");
    await VerificationTokenModel.create<{userId:string}>({
        userId,
        token: randomToken,
    })
    const link = `${process.env.VERIFICATION_LINK}?token=${randomToken}&userId=${userId}`;
    await mail.sendVerificationMail({
        link,
        to: user.email
    })
    res.json({message:"Please check your email for link"});
};

export const verifyAuthToken: RequestHandler = async (req, res) => {
    const { token, userId } = req.query;

    if(typeof token !== 'string' || typeof userId !== 'string'){
        return sendErrorResponse({
            status: 403,
            message: 'Invalid Request!',
            res
        })
    }

    const verificationToken = await VerificationTokenModel.findOne({userId});
    if(!verificationToken || !verificationToken.compare(token)){
        return sendErrorResponse({
            status: 403,
            message: 'Invalid Request, Token mismatch!',
            res
        })
    }

    const user = await UserModel.findById(userId);

    if(!user){
        return sendErrorResponse({
            status: 500,
            message: 'Something went wrong, User not found!',
            res
        })
    }

    await VerificationTokenModel.findByIdAndDelete(verificationToken._id);

    const payload = {userId: user._id}

    const authToken = jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '15d'
    });

    res.cookie('authToken', authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: 'strict',
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    })

    // res.redirect(`${process.env.AUTH_SUCCESS_URL}?profile=${JSON.stringify(
    //     formatUserProfile(user)
    // )}`)

    res.send();
}

export const sendProfileInfo: RequestHandler = (req, res) => {
    res.json({
        profile: req.user
    })
};


export const logout: RequestHandler = (req, res) => {
    res.clearCookie('authToken').send()
};
