export interface IRating {
	filmId: number,
	starsCount: number,
	ratingsCount: number,
	userRating?: number,
	isAuth: boolean
}
