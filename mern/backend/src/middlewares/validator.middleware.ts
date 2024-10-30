import { RequestHandler} from "express";
import { z, ZodType } from "zod";

export const emailValidationSchema = z.object({
    email: z.string({
        required_error:"Email is Required",
        invalid_type_error: "Invalid email type"
    }).email("Invalid Email")
});
export const newUserSchema= z.object({
    name: z.string({
        required_error:"Name is Required",
        invalid_type_error: "Invalid Name!"
    }).min(3, "Name must be 3 characters long").trim()
});

export const newAuthorSchema= z.object({
    name: z.string({
        required_error:"Name is Required",
        invalid_type_error: "Invalid Name!"
    }).min(3, "Name must be 3 characters long").trim(),
    about: z.string({
        required_error:"About is Required",
        invalid_type_error: "Invalid About!"
    }).min(100, "Please write at least 100 characters about yourself").trim(),
    socialLinks: z.array
    (z.string().url("Social links can only be list of valid URL's"))
    .optional(),
});

export const validate = <T extends unknown>(schema: ZodType<T>): RequestHandler => {
    return (req, res, next): void => {

        const result = schema.safeParse(req.body);
        if (result.success) {
            req.body = result.data;
            next();
        } else {
            const errors = result.error.flatten().fieldErrors;
            res.status(422).json({ errors });
        }
    };
};
