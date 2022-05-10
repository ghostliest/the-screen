import { FilmRatingInterface } from '../models/films.model.interface'

export interface IRatingService {
	createRating(filmId: number): Promise<void>
	getRating(filmId: number): Promise<FilmRatingInterface>
	updateFilmRate(filmId: number, count: number, rate: number): Promise<void>
	getUserRate(userId: number, filmId: number): Promise<number | null>
	createUserRate(rating: number, filmId: number, userId: number): Promise<void>
	updateUserRate(rating: number, filmId: number, userId: number): Promise<void>
	deleteUserRate(filmId: number, userId: number): Promise<void>
}
