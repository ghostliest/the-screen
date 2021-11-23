import { Response, NextFunction } from "express";
import CustomRequest from '../types/customRequest';
import jwt from "jsonwebtoken";
import ApiError from '../error/ApiError';

export default function (req: CustomRequest, res: Response, next: NextFunction) {
	try {
		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			return next(ApiError.unauthorized("No authorization"))
		}

		const decoded: any = jwt.verify(token, `${process.env.SECRET_KEY}`);
		console.log("decoded:", decoded);

		req.user = decoded;
		next();
	} catch (e: any) {
		console.log(e.message);
		next(ApiError.unauthorized(e.message))
	}
}