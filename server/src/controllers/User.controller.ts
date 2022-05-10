import { Request, Response, NextFunction } from 'express'
import BaseController from './Base.controller'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import HttpStatus from '../error/HttpStatus'
import CustomRequest from '../interfaces/customRequest.interface'
import { IRatingService } from '../interfaces/services/rating.service.interface'
import { IFoldersService } from '../interfaces/services/folders.service.interface'
import { IUserService } from '../interfaces/services/user.service.interface'

export default class UserController extends BaseController {
	constructor (
		private readonly userService: IUserService,
		private readonly foldersService: IFoldersService,
		private readonly ratingService: IRatingService
	) {
		super()
		this.generateJwt = this.generateJwt.bind(this)
		this.registration = this.registration.bind(this)
		this.login = this.login.bind(this)
		this.check = this.check.bind(this)
		this.update = this.update.bind(this)
		this.delete = this.delete.bind(this)
		this.addRate = this.addRate.bind(this)
		this.checkRate = this.checkRate.bind(this)
	}

	private generateJwt (id: number, email: string, role: string): string {
		return jwt.sign(
			{ id, email, role },
			`${process.env.SECRET_KEY}`,
			{ expiresIn: '24h' }
		)
	}

	public async registration (req: Request, res: Response, next: NextFunction) {
		try {
			const { email, userName, password } = req.body

			if (!email || !userName) {
				return next(HttpStatus.badRequest('Not all fields are filled'))
			}

			const { checkUser, createUser } = this.userService
			const { createFolders } = this.foldersService

			const futureUser = await checkUser(email)

			if (futureUser?.email === email && futureUser?.username === userName) {
				return next(HttpStatus.badRequest('User with such email and username already exists'))
			} else if (futureUser?.email === email) {
				return next(HttpStatus.badRequest('User with such email already exists'))
			} else if (futureUser?.username === userName) {
				return next(HttpStatus.badRequest('Username already taken'))
			}

			if (!futureUser && !password) {
				return res.json({ canAuthorize: true })
			}

			const hashPassword = await bcrypt.hash(password, 5)

			const user = await createUser(email, userName, hashPassword)
			await createFolders(user.id)

			const token = this.generateJwt(user.id, user.email, user.role)
			return res.json({ token })
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}

	public async login (req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body

			const user = await this.userService.checkUser(email)
			if (!user) {
				return next(HttpStatus.badRequest("User with such email doesn't exist"))
			} else if (user && !password) {
				return res.json({ canAuthorize: true })
			}

			const comparePassword = await bcrypt.compare(password, user.password)
			if (!comparePassword) {
				return next(HttpStatus.badRequest('Invalid password'))
			}

			const token = this.generateJwt(user.id, user.email, user.role)
			return res.json({ token })
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}

	public async check ({ user }: CustomRequest, res: Response, next: NextFunction) {
		try {
			const token = this.generateJwt(user!.id, user!.email, user!.role)
			res.json({ token })
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}

	public async delete (req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const { email } = req.user!

			const { checkUser, deleteUser } = this.userService
			const { deleteFolders } = this.foldersService

			const user = await checkUser(email)
			await deleteFolders(user!.id)
			await deleteUser(user!.id)

			return res.json({ status: 'ok' })
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}

	public async update (req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const { username, password } = req.body
			const { email } = req.user!

			const { checkUser, updateUser } = this.userService

			const user = await checkUser(email)
			if (!user) return next(HttpStatus.badRequest('User not found'))

			const isPassword = await bcrypt.compare(password, user.password)

			if (user.username === username && isPassword) {
				return next(HttpStatus.badRequest('The new username and password cannot match the old one'))
			} else if (user.username === username) {
				return next(HttpStatus.badRequest('The new username cannot match the old one'))
			} else if (isPassword) {
				return next(HttpStatus.badRequest('The new user password cannot match the old one'))
			}

			const hashPassword = await bcrypt.hash(password, 5)
			await updateUser(user.id, { username, password: hashPassword })
			const token = this.generateJwt(user.id, user.email, user.role)

			return res.json({ token })
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}

	public async addRate (req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const { id: userId } = req.user!
			const { filmId, rating: newRating }: { filmId: number, rating: number } = req.body

			if (newRating < -1 || newRating === 0 || newRating > 10) {
				throw new Error('Invalid value')
			}

			const { getUserRate, createUserRate, deleteUserRate, updateFilmRate, updateUserRate } = this.ratingService

			const userRate = await getUserRate(userId, filmId)

			if (!userRate && newRating === -1) {
				throw new Error('Invalid operation')
			}

			const count = newRating <= 0 ? -1 : 1
			const rate = count === -1 ? -userRate! : newRating

			if (userRate && newRating === -1) {
				await deleteUserRate(filmId, userId)
				await updateFilmRate(filmId, count, rate)
			} else if (!userRate && newRating >= 1) {
				await createUserRate(newRating, filmId, userId)
				await updateFilmRate(filmId, count, rate)
			} else if (userRate && newRating >= 1) {
				await updateUserRate(newRating, filmId, userId)
				await updateFilmRate(filmId, 0, newRating - userRate)
			}

			return res.json({ message: 'OK' })
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}

	public async checkRate ({ user, query }: CustomRequest, res: Response, next: NextFunction) {
		try {
			const userId = user!.id
			const filmId = Number(query.filmId)

			const rate = await this.ratingService.getUserRate(userId, filmId)

			if (rate) {
				return res.json({ rate })
			} else {
				return res.json({ message: 'none' })
			}
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}
}
