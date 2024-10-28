import { compareSync, genSaltSync, hashSync } from "bcrypt";
import { Model, Schema, model } from "mongoose";

interface VerificationTokenDoc {
    userId: string;
    token: string;
    expires: Date;
}

type Methods = {
    compare(token: string): boolean
};
const VerificationTokenSchema = new Schema<VerificationTokenDoc, {}, Methods>({
    userId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        default: Date.now(),
        expires: 60 * 60 * 24
    },
});

VerificationTokenSchema.pre('save', function(next){
    if(this.isModified('token')){
        const salt = genSaltSync(10);
        this.token = hashSync(this.token, salt)
    }

    next()
});

VerificationTokenSchema.methods.compare = function(token){
    return compareSync(token, this.token)
}
const VerificationTokenModel = model("VerificationToken", VerificationTokenSchema);
export default VerificationTokenModel as Model<VerificationTokenDoc, {}, Methods>;
