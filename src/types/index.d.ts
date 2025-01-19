import "express";
import { JwtPayload } from "jsonwebtoken";

declare module "express" {
    interface Request {
        jwtDecoded?: JwtPayload;
    }
}
