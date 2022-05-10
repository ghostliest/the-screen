import { BuildOptions, Model } from 'sequelize'
import { BaseModelInterface } from './base.model.interface'

export interface FilmModelInterface extends Model, BaseModelInterface {
	id: number,
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
	id: number,
	filmId: number,
	duration: number,
	description?: string,
	ageRating: number,
	youtubeTrailerKey: string,
	seasonCount: null | number
}

export type FilmDetailsModelStatic = typeof Model & {
	new(values?: object, options?: BuildOptions): FilmDetailsModelInterface;
}

export interface FilmDetailsMetaModelInterface extends Model, BaseModelInterface {
	actor: number[],
	director: number[],
	country: number[],
	genre: number[],
	[key: string]: any
}

export interface FullFilmModelInterface extends
	BaseModelInterface,
	FilmModelInterface,
	FilmDetailsModelInterface,
	FilmDetailsMetaModelInterface { }

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
