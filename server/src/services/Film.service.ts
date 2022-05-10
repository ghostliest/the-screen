import sequelize from '../db'
import {
	Film,
	FilmDetails,
	FilmRating
} from '../models/models'
import BaseService from './Base.service'
import {
	FilmDetailsMetaModelInterface,
	FilmDetailsModelInterface,
	FilmModelInterface
} from '../interfaces/models/films.model.interface'
import {
	ICheckFilmByTitle,
	IFilmsAndCount,
	IFilmService,
	IGetFilmsAndCount,
	IGetFilmsById
} from '../interfaces/services/film.service.interface'

export default class FilmService extends BaseService implements IFilmService {
	private metaDbTables: { [key: string]: { table: string, col: string } } = {
		director: { table: 'directors', col: 'name' },
		actor: { table: 'actors', col: 'name' },
		country: { table: 'countries', col: 'country' },
		genre: { table: 'genres', col: 'genre' }
	}

	constructor () {
		super()
		this.createFilmDetails = this.createFilmDetails.bind(this)
		this.createFilm = this.createFilm.bind(this)
		this.createMeta = this.createMeta.bind(this)

		this.getFilm = this.getFilm.bind(this)
		this.getFilmsAndCount = this.getFilmsAndCount.bind(this)
		this.getFilmsByIds = this.getFilmsByIds.bind(this)
		this.getDetails = this.getDetails.bind(this)
		this.getMeta = this.getMeta.bind(this)

		this.updateFilm = this.updateFilm.bind(this)
		this.updateFilmDetails = this.updateFilmDetails.bind(this)
		this.updateMeta = this.updateMeta.bind(this)

		this.checkFilmByTitle = this.checkFilmByTitle.bind(this)
	}

	public async createFilmDetails (detailsInfo: FilmDetailsModelInterface, filmId: number) {
		return await FilmDetails.create({ ...detailsInfo, filmId }, { raw: true })
	}

	public async createFilm (filmInfo: FilmModelInterface) {
		return (await Film.create(filmInfo)).get({ plain: true })
	}

	public async createMeta (metaInfo: FilmDetailsMetaModelInterface, detailsId: number) {
		const metaKeys = Object.keys(metaInfo) // ['actor', 'director', 'country', 'genre']

		for (const metaKey of metaKeys) {
			const curMetaItem: { [key: string]: number[] } = metaInfo[metaKey]

			for (const metaValueKey in curMetaItem) {
				const metaAction = curMetaItem[metaValueKey]

				for (const item of metaAction) {
					await sequelize.query(
						`INSERT INTO "${'film-detail_' + this.metaDbTables[metaKey].table}"` +
						` ("id", "${metaKey + 'Id'}", "filmDetailId", "createdAt", "updatedAt")` +
						` VALUES (DEFAULT, ${item}, ${detailsId}, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))`
					)
				}
			}
		}
	}

	public async getFilm (filmId: number) {
		return await sequelize.query(
			`SELECT "id", "title", "year", "img", "isFilm", "completionYear" FROM films WHERE id = ${filmId}`,
			{ plain: true }
		) as unknown as FilmModelInterface
	}

	public async getFilmsAndCount ({ limit, offset, type, yearStart, yearEnd, genre, country, sort = 'popular' }: IGetFilmsAndCount) {
		const sql = `
			WITH films AS(
				SELECT "film"."id", "film"."title", "film"."year" AS year, "film"."img", "film"."isFilm", "film"."completionYear",
				"rating"."ratingsCount" AS "ratingsCount",
				"rating"."starsCount" AS "starsCount",
				"details"."youtubeTrailerKey" AS "youtubeTrailerKey"
				FROM "films" AS "film"
				JOIN "film-ratings" AS "rating" ON "film"."id" = "rating"."filmId"
				JOIN "film-details" AS "details" ON "film"."id" = "details"."filmId"
				${genre ? 'JOIN "film-detail_genres" AS "details->genres" ON "details"."id" = "details->genres"."filmDetailId" AND "details->genres"."genreId" = ' + genre : ''}
				${country ? 'JOIN "film-detail_countries" AS "details->countries" ON "details"."id" = "details->countries"."filmDetailId" AND "details->countries"."countryId" = ' + country : ''}
				${type === 'all' ? '' : type === 'film' ? 'WHERE film."isFilm" = true' : 'WHERE film."isFilm" = false'}
				${yearStart && yearEnd ? 'AND year BETWEEN	' + yearStart + ' AND ' + yearEnd : ''}
				${yearStart && !yearEnd ? 'AND year = ' + yearStart : ''}
				${yearEnd && !yearStart ? 'AND film."completionYear" = ' + yearEnd : ''}
			)
			SELECT (SELECT CAST(COUNT(*) AS INT) FROM films) AS count,
			(SELECT json_agg(t.*)
				FROM (
					SELECT * FROM films
					ORDER BY
					${sort === 'date' ? 'year' : ''}
					${sort === 'popular' ? '"ratingsCount"' : ''}
					${sort === 'rating' ? 'CASE WHEN "starsCount" = 0 THEN 1 ELSE "starsCount" / "ratingsCount" END' : ''}
					DESC
					LIMIT ${limit} 
					OFFSET ${offset}
				) AS t
			) AS rows 
		`

		const films = await sequelize.query(sql, { nest: true }) as any
		return films[0] as IFilmsAndCount
	}

	public async getFilmsByIds (ids: number[]) {
		return await Film.findAll({
			where: { id: ids },
			attributes: ['id', 'title', 'year', 'img', 'isFilm', 'completionYear'],
			include: [{
				model: FilmRating,
				as: 'rating',
				attributes: ['ratingsCount', 'starsCount']
			}]
		}) as unknown as IGetFilmsById
	}

	public async getDetails (filmId: number) {
		return await sequelize.query(
			'SELECT "id", "ageRating", "duration", "description", "youtubeTrailerKey", "seasonCount"' +
			` FROM "film-details" WHERE "filmId" = ${filmId}`,
			{ plain: true }
		) as unknown as FilmDetailsModelInterface
	}

	public async getMeta (filmDetailId: number, limit: number = 100) {
		const meta = {} as FilmDetailsMetaModelInterface
		const keys = Object.keys(this.metaDbTables)

		for (const metaDbKey of keys) {
			const curDbInfo = this.metaDbTables[metaDbKey]

			const metaKeys = await sequelize.query(
				`SELECT ARRAY(SELECT "${metaDbKey + 'Id'}" FROM "${'film-detail_' + curDbInfo.table}"` +
				` WHERE "filmDetailId" = ${filmDetailId} LIMIT ${limit})`,
				{ plain: true }
			) as { array: [number] }

			const metaItems: Array<Object> = []

			for (const metaValue of metaKeys.array) {
				const metaItem = await sequelize.query(
					`SELECT "id", "${curDbInfo.col}" as "value" FROM "${curDbInfo.table}" WHERE "id" = ${metaValue}`,
					{ plain: true }
				) as { array: [string] }

				metaItems.push(metaItem)
			}

			meta[curDbInfo.table] = metaItems
		}

		return meta
	}

	public async updateFilm (filmInfo: FilmModelInterface, filmId: number) {
		await Film.update(
			filmInfo,
			{ where: { id: filmId } }
		) as unknown as FilmModelInterface
	}

	public async updateFilmDetails (detailsInfo: FilmDetailsModelInterface, filmId: number) {
		await FilmDetails.update(
			detailsInfo,
			{ where: { filmId } }
		) as unknown as FilmDetailsModelInterface
	}

	public async updateMeta (metaInfo: FilmDetailsMetaModelInterface, filmDetailId: number) {
		const metaKeys = Object.keys(metaInfo)

		for (const metaKey of metaKeys) {
			const curMetaItem: number[] = metaInfo[metaKey]

			if (!curMetaItem) continue
			const metaMethodsKeys: Array<string> = Object.keys(metaInfo[metaKey]) // [ add, delete, replace ]
			const methods: { [key: string]: number[] } = metaInfo[metaKey] // { add: [ 6, 4 ], delete: [] }
			const tableName = 'film-detail_' + this.metaDbTables[metaKey].table
			const colMetaPK = metaKey + 'Id'
			const colDetailPK = 'filmDetailId'

			for (const metaMethod of metaMethodsKeys) {
				const curValues: number[] = methods[metaMethod]

				for (const curValue of curValues) {
					if (metaMethod === 'add') {
						await sequelize.query(
							`INSERT INTO "${tableName}"` +
							` ("id", "${colDetailPK}", "${colMetaPK}", "createdAt", "updatedAt")` +
							` VALUES (DEFAULT, ${filmDetailId}, ${curValue}, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))`
						)
					} else if (metaMethod === 'delete') {
						await sequelize.query(
							`DELETE FROM "${tableName}"` +
							` WHERE "${colDetailPK}" = ${filmDetailId} AND "${colMetaPK}" = ${curValue}`
						)
					} else if (metaMethod === 'replace') {
						// await sequelize.query(
						// 	`UPDATE "${tableName}" SET "${colMetaPK}" = ${curValOfMethod[k][1]}`
						// 	+ ` WHERE "${colDetailPK}" = ${details.id} AND "${colMetaPK}" = ${curValOfMethod[k][0]}`
						// )
					}
				}
			}
		}
	}

	public async checkFilmByTitle (title: string) {
		return await Film.findOne({
			where: { title },
			attributes: ['id', 'title'],
			raw: true
		}) as unknown as ICheckFilmByTitle | null
	}
}
