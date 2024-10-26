import { RequestHandler } from "express";
import crypto from "crypto";
import VerificationTokenModel from "@/models/verificationToken.model";
import UserModel from "@/models/user.model";


export const generateAuthLink:RequestHandler = async (req, res) => {
    const {email} = req.body;
    let user = await UserModel.findOne({email});

    if(!user){
        user = await UserModel.create({
            email
        })
    }
    const randomToken = crypto.randomBytes(36).toString("hex");
    await VerificationTokenModel.create<{userId:string}>({
        userId: user._id.toString(),
        token: randomToken,
    })
    res.json({ok: true});
};
