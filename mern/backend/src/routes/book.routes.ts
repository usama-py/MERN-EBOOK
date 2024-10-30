import { createNewBook } from "@/controllers/book.controller";
import { isAuth, isAuthor } from "@/middlewares/auth.middlewares";
import { fileParser } from "@/middlewares/files.middlewares";
import { newBookSchema, validate } from "@/middlewares/validator.middleware";
import { Router } from "express";

const bookRouter = Router();

bookRouter.post('/create', isAuth, isAuthor, fileParser, validate(newBookSchema), createNewBook);

export default bookRouter;
