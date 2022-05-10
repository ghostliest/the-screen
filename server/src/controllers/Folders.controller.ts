import { Response, NextFunction } from 'express'
import HttpStatus from '../error/HttpStatus'
import BaseController from './Base.controller'
import CustomRequest from '../interfaces/customRequest.interface'
import { IFilmService } from '../interfaces/services/film.service.interface'
import { IRatingService } from '../interfaces/services/rating.service.interface'
import { IFoldersService } from '../interfaces/services/folders.service.interface'

export default class FoldersController extends BaseController {
	constructor (
		private readonly filmService: IFilmService,
		private readonly foldersService: IFoldersService,
		private readonly ratingService: IRatingService
	) {
		super()
		this.addToFolder = this.addToFolder.bind(this)
		this.checkItemInFolder = this.checkItemInFolder.bind(this)
		this.getFolder = this.getFolder.bind(this)
	}

	public async addToFolder (req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const folderName = req.params.name
			const filmId = +req.body.filmId
			const userId = req.user!.id

			if (!filmId) {
				return next(HttpStatus.badRequest('Film is not specified'))
			}

			const folderItem = await this.foldersService.addToFolder(userId, filmId, folderName)

			if (folderItem) {
				return res.json({ operation: 'add' })
			} else {
				return res.json({ operation: 'remove' })
			}
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}

	public async getFolder (req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const folderName = req.params.name
			const { id } = req.user!

			let { page, limit, count } = req.query as any
			page = +page || 1
			limit = +limit || 5
			count = +count
			const start = page * limit - limit
			const end = start + limit

			this.logger.log('req.params:', req.params)
			this.logger.log('page, limit, offset:', { page, limit, start, end })

			const { getFolderContentIds, getFolderContentAdded } = this.foldersService

			let contentIds = await getFolderContentIds(id, folderName)
			if (!contentIds) {
				return next(HttpStatus.badRequest('This folder is empty'))
			}

			const contentCount = contentIds.length

			if (count) {
				contentIds = contentIds.slice(0, count)
			} else {
				contentIds = contentIds.slice(start, end)
			}
			const { getFilm, getDetails, getMeta } = this.filmService
			const { getRating, getUserRate } = this.ratingService
			const films: Array<{}> = []

			for (const folderFilmId of contentIds) {
				const film = await getFilm(folderFilmId)
				const details = await getDetails(folderFilmId)
				const contentAdded = await getFolderContentAdded(id, folderName, folderFilmId)
				const rating = await getRating(folderFilmId)
				const userRating = await getUserRate(id, folderFilmId)
				const meta = await getMeta(details.id!, 3)

				films.push({
					...film,
					added: contentAdded,
					details: {
						duration: details.duration
					},
					rating: {
						...rating,
						userRating
					},
					...meta
				})
			}

			return res.json({
				count: contentCount,
				rows: films
			})
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}

	public async checkItemInFolder (req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const folderName = String(req.query.name)
			const filmId = Number(req.query.filmId)
			const { id } = req.user!

			const checkItem = await this.foldersService.checkInFolder(id, filmId, folderName)
			return res.json({ status: checkItem })
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}
}
