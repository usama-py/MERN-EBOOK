import { generateAuthLink, sendProfileInfo, verifyAuthToken, logout} from "@/controllers/auth.controller";
import { isAuth } from "@/middlewares/auth.middlewares";
import { emailValidationSchema, validate } from "@/middlewares/validator.middleware";
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
export default authRouter
