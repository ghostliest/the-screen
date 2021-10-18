import { BuildOptions, Model } from 'sequelize';
import { BaseModelInterface } from './baseTypes';

export interface FilmModelInterface extends Model, BaseModelInterface {
	title: string,
	year: number,
	completionYear: number,
	img: string,
	isFilm: boolean
}

export type FilmModelStatic = typeof Model & {
	new(values?: object, options?: BuildOptions): FilmModelInterface;
}

export interface FilmDetailsModelInterface extends Model, BaseModelInterface {
	readonly filmId: number,
	duration: number,
	description: string,
	ageRating: number,
	youtubeTrailerKey: string,
	seasonCount: null | number
}

export type FilmDetailsModelStatic = typeof Model & {
	new(values?: object, options?: BuildOptions): FilmDetailsModelInterface;
}

export interface PaginationQueryInterface {
	page: number,
	limit: number,
	isFilm: boolean
}

export interface FilmRatingInterface extends Model, BaseModelInterface {
	ratingsCount: number,
	starsCount: number
}

export type FilmRatingInterfaceStatic = typeof Model & {
	new(values?: object, options?: BuildOptions): FilmRatingInterface;
}