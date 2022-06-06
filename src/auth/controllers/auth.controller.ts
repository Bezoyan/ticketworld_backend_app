import { Request, Response } from "express";
import { User } from "../models/user";
import { Password } from "../services/password";
import { genToken } from '../services/helper/jwtHelper'

    async function SignUp(req: Request, res: Response) {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw res.boom.conflict("Email already in use");
        }

        const user = await User.create({ email, password });
       
        // Generate JWT token
        const userJwt = genToken(user.id, email);
        const token = req.headers = {
            jwt: userJwt,
        };

        res.status(201).send({user, token});
    }

    async function SignIn(req: Request, res: Response) {
        const { email, password } = req.body;
        const jsonWebToken = req.headers.authorization?.split(' ')[1];
        const user = await User.findOne({ email });
        if (!user) {
            throw res.boom.forbidden("Invalid email");
        }

        const passwordsMatch = await Password.compare(
            user.password,
            password
        );
        if (!passwordsMatch) {
            throw res.boom.forbidden("Invalid password");
        }
       
        const token = req.session = {
            jwt: jsonWebToken,
        };
        res.status(200).send({user, token});
    }

    async function SignOut (req: Request, res: Response) {
        req.session = null;
        res.send({});
    };

export default { 
    SignUp,
    SignIn,
    SignOut
};
