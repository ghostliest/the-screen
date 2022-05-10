import { Request } from 'express'

export default interface CustomRequest extends Request {
	user?: {
		id: number,
		email: string,
		role: string,
		iat: number,
		exp: number
	}
}
