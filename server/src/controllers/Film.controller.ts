import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'
import HttpStatus from '../error/HttpStatus'
import BaseController from './Base.controller'
import {
	FilmDetailsMetaModelInterface,
	FilmDetailsModelInterface,
	FilmModelInterface
} from '../interfaces/models/films.model.interface'
import CustomRequest from '../interfaces/customRequest.interface'
import { IRatingService } from '../interfaces/services/rating.service.interface'
import { IFilmService } from '../interfaces/services/film.service.interface'
import { IFilmController, IQueryGetAllFilms } from '../interfaces/controllers/film.controller.interface'

export default class FilmController extends BaseController implements IFilmController {
	constructor (
		private readonly filmService: IFilmService,
		private readonly ratingService: IRatingService
	) {
		super()
		this.create = this.create.bind(this)
		this.update = this.update.bind(this)
		this.getOne = this.getOne.bind(this)
		this.infoDestruction = this.infoDestruction.bind(this)
		this.createImg = this.createImg.bind(this)
		this.createRecords = this.createRecords.bind(this)
		this.getAll = this.getAll.bind(this)
		this.getAllByIds = this.getAllByIds.bind(this)
	}

	private async infoDestruction (body: any, filename: string | undefined): Promise<any> {
		function jsonParser (field: any) {
			if (field === undefined) {
				return undefined
			} else {
				const tmp = JSON.parse(field)
				return +tmp || tmp
			}
		}

		return {
			filmInfo: {
				title: jsonParser(body.title),
				year: jsonParser(body.year),
				completionYear: jsonParser(body.completionYear),
				img: filename || undefined,
				isFilm: jsonParser(body.isFilm)
			} as FilmModelInterface,
			detailsInfo: {
				ageRating: jsonParser(body.ageRating),
				duration: jsonParser(body.duration),
				description: jsonParser(body.description),
				seasonCount: jsonParser(body.seasonCount),
				youtubeTrailerKey: jsonParser(body.youtubeTrailerKey)
			} as FilmDetailsModelInterface,
			metaInfo: {
				actor: jsonParser(body.actors),
				director: jsonParser(body.directors),
				genre: jsonParser(body.genres),
				country: jsonParser(body.countries)
			} as unknown as FilmDetailsMetaModelInterface
		}
	}

	private async createImg (img: any) {
		const filename: string = `${uuidv4()}.jpg`
		await img.mv(path.resolve(__dirname, '..', '..', 'static', filename))
		return filename
	}

	private async createRecords (filmInfo: FilmModelInterface, detailsInfo: FilmDetailsModelInterface, metaInfo: FilmDetailsMetaModelInterface): Promise<any> {
		const { createFilm, createFilmDetails, createMeta } = this.filmService
		const { createRating } = this.ratingService

		const film = await createFilm(filmInfo)
		const details = await createFilmDetails(detailsInfo, film.id!)
		await createMeta(metaInfo, details.id)
		await createRating(film.id!)

		return { ...film, details, metaInfo }
	}

	public async create (req: Request, res: Response, next: NextFunction): Promise<any> {
		try {
			const filmCheck = await this.filmService.checkFilmByTitle(JSON.parse(req.body.title))

			if (filmCheck) throw new Error(`Film with title '${filmCheck.title}' already exists`)
			if (!req.files?.img) throw new Error('No image')

			const filename = await this.createImg(req.files?.img)
			const { filmInfo, detailsInfo, metaInfo }: {
				filmInfo: FilmModelInterface,
				detailsInfo: FilmDetailsModelInterface,
				metaInfo: FilmDetailsMetaModelInterface
			} = await this.infoDestruction(req.body, filename)

			this.logger.log({ filmInfo, detailsInfo, metaInfo })

			const result = await this.createRecords(filmInfo, detailsInfo, metaInfo)
			this.logger.log('create-result:', result)
			return res.json({ ...result, status: 'ok' })
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}

	public async update (req: Request, res: Response, next: NextFunction) {
		try {
			const id = +req.params.id
			let filename: string | undefined
			const bodyLength = Object.keys(req.body).length

			if (!bodyLength && !req.files) {
				throw new Error("You haven't changed any of the fields")
			}

			const { getFilm, updateFilm, updateFilmDetails, getDetails, updateMeta } = this.filmService

			if (req.files) {
				filename = await this.createImg(req.files.img)
				const film = await getFilm(id)
				fs.unlink(path.join(__dirname, '..', '..', 'static', film.img), (e) => e)
			} else {
				filename = undefined
			}

			const { filmInfo, detailsInfo, metaInfo }: {
				filmInfo: FilmModelInterface,
				detailsInfo: FilmDetailsModelInterface,
				metaInfo: FilmDetailsMetaModelInterface
			} = await this.infoDestruction(req.body, filename)

			await updateFilm(filmInfo, id)
			await updateFilmDetails(detailsInfo, id)
			const details = await getDetails(id)
			await updateMeta(metaInfo, details.id!)

			return res.json({ status: 'ok' })
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}

	public async getAll ({ query }: Request<{}, {}, {}, IQueryGetAllFilms>, res: Response, next: NextFunction) {
		try {
			let { page, limit, type, sort, country, genre, year = '' } = query
			page = +page || 1
			limit = +limit || 20
			const offset = page * limit - limit
			let years = ['']
			genre = +genre
			country = +country

			if (year !== '') {
				years = year.split('-')
			}

			const films = await this.filmService.getFilmsAndCount({
				type,
				yearStart: +years[0],
				yearEnd: +years[1],
				genre,
				country,
				sort,
				limit,
				offset
			})

			return res.json(films)
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}

	public async getAllByIds (req: Request, res: Response, next: NextFunction) {
		try {
			const ids: number[] = JSON.parse(`${req.query.ids}`)
			const films = await this.filmService.getFilmsByIds(ids)

			return res.json(films)
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}

	public async getOne (req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const id = Number(req.params.id)

			const { getFilm, getDetails, getMeta } = this.filmService
			const { getRating } = this.ratingService

			const film = await getFilm(id)
			const details: any = await getDetails(id)
			const rating = await getRating(id)
			const meta = await getMeta(details.id!, 10)

			delete details.id
			const result = {
				...film,
				rating,
				details,
				...meta
			}

			return res.json(result)
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}
}
