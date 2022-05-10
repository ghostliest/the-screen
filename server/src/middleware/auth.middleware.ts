import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import HttpStatus from '../error/HttpStatus'
import CustomRequest from '../interfaces/customRequest.interface'

export default function (req: CustomRequest, res: Response, next: NextFunction) {
	try {
		const token = req.headers.authorization?.split(' ')[1]
		if (!token) {
			return next(HttpStatus.unauthorized('No authorization'))
		}
		const decoded: any = jwt.verify(token, `${process.env.SECRET_KEY}`)
		req.user = decoded
		next()
	} catch (e: any) {
		console.log(e.message)
		next(HttpStatus.unauthorized(e.message))
	}
}
