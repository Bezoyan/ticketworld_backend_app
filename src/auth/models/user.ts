import mongoose from "mongoose";
import { Password } from "../services/password";

interface UserAttrs {
    email: string;
    password: string;
    //roles: [string];
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    // roles: {
    //     type: [{
    //         type: String,
    //         enum: ['user', 'admin']
    //     }],
    //     default: ['user']
    // },
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
            },
        },
    }
);

// Hash the password with pre-seve hook
userSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashed = await Password.toHash(this.get("password"));
        this.set("password", hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User: UserModel = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
