import AuthorModel from "@/models/author.model";
import BookModel, { BookDoc } from "@/models/book.model";
import { CreateBookRequestHandler } from "@/types/index.types";
import { uploadBookToLoaclDir, uploadCoverToCloudinary } from "@/utils/fileUpload.utils";
import { formatFileSize, sendErrorResponse } from "@/utils/helper.utils";
import  * as fs from "fs";
import { Types } from "mongoose";
import path from "path";
import slugify from "slugify";

export const createNewBook: CreateBookRequestHandler = async(req, res)=>{
    const {body, files, user} = req;
    const {title, genre, description, language, fileInfo, price, publicationName, publishedAt} = body;
    const {cover, book} = files;
    if(!book || Array.isArray(book) || book.mimetype !== "application/epub+zip"){
        return sendErrorResponse({
            message: 'Invalid book file!',
            status:422,
            res
        })
    }
    const newBook = new BookModel<BookDoc>({
        title, genre, description, language, fileInfo: {size: formatFileSize(fileInfo.size), id: ''}, price, publicationName, publishedAt, slug: '',
        author: new Types.ObjectId(user.authorId)
    });

    newBook.slug = slugify(`${newBook.title} ${newBook._id}`, {
        lower: true,
        replacement: '-'
    });
    if(cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")){
        newBook.cover = await uploadCoverToCloudinary(cover);
    }
    const uniqueFileName = slugify(`${newBook._id} ${newBook.title}.epub`,{
        lower: true,
        replacement: '-'
    });

    uploadBookToLoaclDir(book, uniqueFileName);
    newBook.fileInfo.id = uniqueFileName;

    await newBook.save();
    await AuthorModel.findByIdAndUpdate(
        user.authorId,{
            $push: { books: newBook._id }
        }
    )

    res.send({
        message: 'Successfully created book'
    })
}
