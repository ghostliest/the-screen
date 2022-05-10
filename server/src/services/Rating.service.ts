import sequelize from '../db'
import { FilmRating, UserRating } from '../models/models'
import BaseService from './Base.service'
import { FilmRatingInterface } from '../interfaces/models/films.model.interface'
import { IRatingService } from '../interfaces/services/rating.service.interface'

class RatingService extends BaseService implements IRatingService {
	constructor () {
		super()
		this.createRating = this.createRating.bind(this)
		this.getRating = this.getRating.bind(this)
		this.updateFilmRate = this.updateFilmRate.bind(this)
		this.getUserRate = this.getUserRate.bind(this)
		this.createUserRate = this.createUserRate.bind(this)
		this.deleteUserRate = this.deleteUserRate.bind(this)
	}

	public async createRating (filmId: number) {
		await FilmRating.create({ ratingsCount: 0, starsCount: 0, filmId })
	}

	public async getRating (filmId: number) {
		return await sequelize.query(
			`SELECT "ratingsCount", "starsCount" FROM "film-ratings" WHERE "filmId" = ${filmId}`,
			{ plain: true }
		) as unknown as FilmRatingInterface
	}

	public async updateFilmRate (filmId: number, count: number, rate: number) {
		this.logger.info('updateFilmRate: ', { filmId, count, rate })
		await sequelize.query(
			'UPDATE "film-ratings" SET' +
			` "ratingsCount" = "ratingsCount" + ${count},` +
			` "starsCount" = "starsCount" + ${rate},` +
			' "updatedAt" = CURRENT_TIMESTAMP(3)' +
			` WHERE "filmId" = ${filmId}`
		)
	}

	public async getUserRate (userId: number, filmId: number) {
		const isRate = await UserRating.findOne({
			where: { filmId, userId },
			attributes: ['rating'],
			raw: true
		}) as unknown as { rating: number }

		this.logger.info({ userId, filmId, isRate })

		return isRate ? isRate.rating : null
	}

	public async createUserRate (rating: number, filmId: number, userId: number) {
		await UserRating.create({ rating, filmId, userId })
	}

	public async updateUserRate (rating: number, filmId: number, userId: number): Promise<void> {
		await UserRating.update({ rating }, { where: { filmId, userId } })
	}

	public async deleteUserRate (filmId: number, userId: number) {
		await UserRating.destroy({ where: { filmId, userId } })
	}
}

export default RatingService
