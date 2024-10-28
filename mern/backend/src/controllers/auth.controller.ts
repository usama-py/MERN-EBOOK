import { RequestHandler } from "express";
import crypto from "crypto";
import VerificationTokenModel from "@/models/verificationToken.model";
import UserModel from "@/models/user.model";
import mail from "@/utils/mail.utils";


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
