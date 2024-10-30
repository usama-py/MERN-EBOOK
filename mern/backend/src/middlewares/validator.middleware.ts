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

export const newBookSchema = z.object({
    title: z.string({
        required_error:"Title is missing!",
        invalid_type_error: "Invalid title!"
    }).trim(),
    description: z.string({
        required_error:"Description is missing!",
        invalid_type_error: "Invalid Description!"
    }).trim(),
    language: z.string({
        required_error:"Language is missing!",
        invalid_type_error: "Invalid Language!"
    }).trim(),
    publishedAt: z.coerce.date({
        required_error:"Published Date is missing!",
        invalid_type_error: "Invalid Published Date!"
    }),
    publicationName: z.string({
        required_error:"Publication Name is missing!",
        invalid_type_error: "Invalid Publication Name!"
    }).trim(),
    genre: z.string({
        required_error:"Genre is missing!",
        invalid_type_error: "Invalid Genre!"
    }).trim(),
    price: z.string({
        required_error:"Price is missing!",
        invalid_type_error: "Invalid Price!"
    }).transform((value, ctx)=>{
        try{
            return JSON.parse(value);
        }catch(error){
            ctx.addIssue({code: "custom", message:"Invalid Price Data"});
            return z.NEVER;
        }
    }).pipe(
        z.object({
            mrp: z.number({
                required_error:"MRP is missing!",
                invalid_type_error: "Invalid MRP!"
            }).nonnegative('Invalid MPR!'),
            sale: z.number({
                required_error:"Sale price is missing!",
                invalid_type_error: "Invalid Sale price!"
            }).nonnegative('Invalid Sale price!')
        })
    ).refine((price)=> price.sale <= price.mrp, "Sale price should be less than MRP"),
    fileInfo: z.string({
        required_error:"File info is missing!",
        invalid_type_error: "Invalid File info!"
    }).transform((value, ctx)=>{
        try{
            return JSON.parse(value);
        }catch(error){
            ctx.addIssue({code: "custom", message:"Invalid File info"});
            return z.NEVER;
        }
    }).pipe(
        z.object({
            name: z.string({
                required_error:"FileInfo.name is missing!",
                invalid_type_error: "Invalid FileInfo.name!"
            }).trim(),
            type: z.string({
                required_error:"FileInfo.type is missing!",
                invalid_type_error: "Invalid FileInfo.type!"
            }).trim(),
            size: z.number({
                required_error:"FileInfo.size is missing!",
                invalid_type_error: "Invalid FileInfo.size!"
            }).nonnegative('Invalid FileInfo.size!')
        })
    )
  })

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
