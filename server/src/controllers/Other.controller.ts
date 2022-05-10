import { Request, Response, NextFunction } from 'express'
import BaseService from '../services/Base.service'
import { Op } from 'sequelize'
import sequelize from '../db'
import HttpStatus from '../error/HttpStatus'
import { Film, FilmRating } from '../models/models'

// TODO: refactor me
// It's very bad ((
export default class OtherController extends BaseService {
	protected endPoints: { [key: string]: { table: string, col: string } } = {
		director: { table: 'directors', col: 'name' },
		actor: { table: 'actors', col: 'name' },
		country: { table: 'countries', col: 'country' },
		genre: { table: 'genres', col: 'genre' },
		film: { table: 'films', col: 'title' }
	}

	constructor () {
		super()
		this.search = this.search.bind(this)
		this.create = this.create.bind(this)
		this.getMeta = this.getMeta.bind(this)
	}

	public async getMeta (req: Request, res: Response, next: NextFunction) {
		try {
			const { limit = 5 } = req.query as any
			const type = req.params.type
			const [temp] = await sequelize.query(
				`SELECT id, ${this.endPoints[type].col} as value` +
				` FROM ${this.endPoints[type].table}` +
				` LIMIT ${limit}`
			)
			return res.json(temp)
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}

	public async search (req: Request, res: Response, next: NextFunction) {
		try {
			const { limit = 5, value } = req.query as any
			const endPoint = req.params.name
			const search = value
				.split(' ')
				.slice(0, 2)
				.map((i: string) => (
					i[0].toLocaleUpperCase() + i.slice(1).toLocaleLowerCase()
				))
				.join(' ')

			const getFilms = async () => {
				const films = await Film.findAll({
					where: { title: { [Op.like]: `${search}%` } },
					limit: 5,
					attributes: ['id', 'title', 'year', 'img', 'isFilm', 'completionYear'],
					include: [
						{
							model: FilmRating,
							as: 'rating',
							attributes: ['ratingsCount', 'starsCount']
						}
					]
				})
				return films
			}

			const getPersons = async () => {
				const keys = Object.keys(this.endPoints).slice(0, 2)
				const persons = []
				for (let i = 0; i < keys.length; i++) {
					const items: any = await sequelize.query(
						`SELECT id, ${this.endPoints[keys[i]].col}` +
						` FROM ${this.endPoints[keys[i]].table}` +
						` WHERE ${this.endPoints[keys[i]].col}` +
						` LIKE '${search}%' LIMIT ${limit}`
					)
					items[0] && persons.push(...items[0])
				}
				return persons
			}

			const notFound = () => {
				return res.json({ message: 'Nothing found' })
			}

			if (endPoint === 'all') {
				const result: { films: object[], persons: object[] } = { films: [], persons: [] }
				result.films = await getFilms()
				result.persons = await getPersons()
				if (result.films.length === 0 && result.persons.length === 0) {
					return notFound()
				}
				return res.json(result)
			} else if (endPoint === 'film') {
				const result: { films: object[] } = { films: [] }
				result.films = await getFilms()
				if (result.films.length === 0) {
					return notFound()
				}
				return res.json(result)
			} else {
				const result: any = {}
				const [temp] = await sequelize.query(
					`SELECT id, ${this.endPoints[endPoint].col} as value` +
					` FROM ${this.endPoints[endPoint].table}` +
					` WHERE ${this.endPoints[endPoint].col}` +
					` LIKE '${search}%' LIMIT ${limit}`
				)
				result[`${this.endPoints[endPoint].table}`] = temp

				return res.json(result)
			}
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}

	public async create (req: Request, res: Response, next: NextFunction) {
		try {
			const endPoint = req.params.name
			const { name }: { name: string } = req.query as any
			const tmp = name.trim().split(' ')
			if (tmp.length < 2 || tmp.length > 3) throw new Error('Check the correctness of the entered data')

			const processedNameArr = []
			for (let i = 0; i < tmp.length; i++) {
				processedNameArr.push(tmp[i][0].toUpperCase() + tmp[i].slice(1).toLowerCase())
			}
			const processedName = processedNameArr.join(' ')

			const [isExist] = await sequelize.query(
				`SELECT id FROM ${this.endPoints[endPoint].table} WHERE ${this.endPoints[endPoint].col} = '${processedName}'`
			)

			const result = { message: `${endPoint[0].toUpperCase() + endPoint.slice(1)} '${processedName}'` }

			if (isExist.length === 0) {
				await sequelize.query(
					`INSERT INTO ${this.endPoints[endPoint].table}` +
					` ("id", "${this.endPoints[endPoint].col}", "createdAt", "updatedAt")` +
					` VALUES (DEFAULT, '${processedName}', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))`
				)
				result.message += ' added'
			} else {
				result.message += ' already exists'
			}

			return res.json(result)
		} catch (e: any) {
			this.logger.error(e.message)
			next(HttpStatus.badRequest(e.message))
		}
	}
}
