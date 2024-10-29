import { RequestHandler} from "express";
import { z, ZodRawShape } from "zod";

export const emailValidationSchema = {
    email: z.string({
        required_error:"Email is Required",
        invalid_type_error: "Invalid email type"
    }).email("Invalid Email")
};
export const newUserSchema= {
    name: z.string({
        required_error:"Name is Required",
        invalid_type_error: "Invalid Name"
    }).min(3, "Name must be 3 characters long").trim()
};

export const validate = <T extends ZodRawShape>(obj: T): RequestHandler => {
    return (req, res, next): void => {
        const schema = z.object(obj);

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
