import { Request, Response, NextFunction } from 'express'
import HttpStatus from '../error/HttpStatus'

export default function (err: any, req: Request, res: Response, next: NextFunction) {
	if (err instanceof HttpStatus) {
		return res
			.status(err.status)
			.json({ message: err.message })
	} else {
		return res
			.status(500)
			.json({ message: 'Unexpected error!' })
	}
}
