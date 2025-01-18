import Jwt from "jsonwebtoken";

const generateToken = async (
    userInfo: Record<string, unknown>,
    secretSignature: string,
    tokenLife: string | number,
) => {
    return Jwt.sign(userInfo, secretSignature, { algorithm: "HS256", expiresIn: tokenLife });
};
const verifyToken = async (token: string, secretSignature: string) => {
    return Jwt.verify(token, secretSignature);
};

export const JwtProvider = { generateToken, verifyToken };
