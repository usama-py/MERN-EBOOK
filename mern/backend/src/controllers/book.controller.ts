import BookModel, { BookDoc } from "@/models/book.model";
import { CreateBookRequestHandler } from "@/types/index.types";
import { formatFileSize } from "@/utils/helper.utils";
import { Types } from "mongoose";
import slugify from "slugify";

export const createNewBook: CreateBookRequestHandler = async(req, res)=>{
    const {body, files, user} = req;
    const {title, genre, description, language, fileInfo, price, publicationName, publishedAt} = body;
    const newBook = new BookModel<BookDoc>({
        title, genre, description, language, fileInfo: {size: formatFileSize(fileInfo.size), id: ''}, price, publicationName, publishedAt, slug: '',
        author: new Types.ObjectId(user.authorId)
    });

    newBook.slug = slugify(`${newBook.title} ${newBook._id}`, {
        lower: true,
        replacement: '-'
    })

    await newBook.save();
}
