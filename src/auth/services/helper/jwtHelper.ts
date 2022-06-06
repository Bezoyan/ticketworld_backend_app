import jwt from "jsonwebtoken";
import { User } from "../../models/user";
// Generate JWT

interface JwtPayload {
  id: string
} 
const genToken = (id: string, email: string) =>
  jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) * 60,
      id,
      email
    },
    process.env.JWT_SECRET! as string,
    )
    // { algorithm: 'RS256' }

const verifyJWT = (token: string) => jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
//const { _id } = jwt.verify(token, 'thisisfromabhishek') as JwtPayload

export { genToken, verifyJWT}

export function verify(authorization: string) {
    throw new Error("Function not implemented.");
}
