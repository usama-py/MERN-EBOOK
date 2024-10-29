import { ObjectId } from "mongodb";
import { Schema, model } from "mongoose";

export interface UserDoc{
    _id: ObjectId
    email: string;
    role: "user" | "author";
    name?: string | null | undefined;
    signedUp: boolean;
    avatar?: {url: string; id: string}
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
    },
    signedUp: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: Object,
        url: String,
        id: String
    }
});

const UserModel = model('User', userSchema);

export default UserModel
