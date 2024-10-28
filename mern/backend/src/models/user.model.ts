import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

export interface UserDoc{
    _id: ObjectId
    email: string;
    role: "user" | "author";
    name?: string | null | undefined;
}
const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ["user", "author"],
        default: "user"
    }
});

const UserModel = model('User', userSchema);

export default UserModel
