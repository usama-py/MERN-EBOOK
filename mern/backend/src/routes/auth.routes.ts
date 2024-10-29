import { generateAuthLink, sendProfileInfo, verifyAuthToken, logout, updateProfile} from "@/controllers/auth.controller";
import { isAuth } from "@/middlewares/auth.middlewares";
import { fileParser } from "@/middlewares/files.middlewares";
import { emailValidationSchema, newUserSchema, validate } from "@/middlewares/validator.middleware";
import { Router } from "express";

const authRouter = Router();

authRouter.post(
    "/generate-link",
    validate(emailValidationSchema),
    generateAuthLink
);

authRouter.get('/verify', verifyAuthToken);
authRouter.get('/profile', isAuth, sendProfileInfo);
authRouter.post('/logout', isAuth, logout);
authRouter.put('/profile', isAuth, fileParser, validate(newUserSchema),updateProfile)
export default authRouter
