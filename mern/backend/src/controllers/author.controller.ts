import AuthorModel from "@/models/author.model";
import UserModel from "@/models/user.model";
import { RequestAuthorHandler } from "@/types/index.types";
import { sendErrorResponse } from "@/utils/helper.utils";
import { RequestHandler } from "express";
import slugify from "slugify";

export const registerAuthor: RequestAuthorHandler = async (req, res) => {
    const {body, user} = req;

    if(!user.signedUp){
        return sendErrorResponse({
            message: "User must be signed up before registering as author",
            status: 401,
            res
        })
    }

    const newAuthor = new AuthorModel({
        name: body.name,
        about: body.about,
        userId: user.id,
        socialLinks: body.socialLinks,
    });

    const uniqueSlug = slugify(`${newAuthor.name} ${newAuthor._id}`,{
        lower: true,
        replacement: '-'
    })

    newAuthor.slug = uniqueSlug;
    await newAuthor.save();

    await UserModel.findByIdAndUpdate(user.id, {
        role: 'author',
        authorId: newAuthor._id
    })

    res.json({
        message: "Thanks for registering as author."
    })
};


export const getAuthorDetails: RequestHandler = async (req, res) => {
    const {slug} = req.params;

    const author = await AuthorModel.findOne({slug});

    if(!author){
        return sendErrorResponse({
            res,
            message: "Author Not found!",
            status: 404
        })
    }

    res.json({
        id: author._id,
        name: author.name,
        about: author.about,
        socialLinks: author.socialLinks
    })
};
