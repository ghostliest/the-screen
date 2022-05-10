import {
	FilmDetailsMetaModelInterface,
	FilmDetailsModelInterface,
	FilmModelInterface
} from '../models/films.model.interface'

export interface IFilmsAndCount {
	count: number,
	rows: [{
		id: number,
		title: string,
		year: number,
		img: string,
		isFilm: boolean,
		completionYear: number | null,
		ratingsCount: number,
		starsCount: number,
		youtubeTrailerKey: string
	}]
}

export interface IGetFilmsAndCount {
	limit: number,
	offset: number,
	type?: 'all' | 'film' | 'series',
	yearStart?: number,
	yearEnd?: number,
	genre?: number,
	country?: number,
	sort?: 'popular' | 'rating' | 'date'
}

export interface IGetFilmsById {
	id: number,
	title: string,
	year: number,
	img: string,
	isFilm: boolean,
	completionYear: number | null,
	rating: {
		ratingsCount: number,
		starsCount: number
	}
}

export interface ICheckFilmByTitle {
	id: number,
	title: string
}

export interface IFilmService {
	createFilmDetails(detailsInfo: FilmDetailsModelInterface, filmId: number): Promise<FilmDetailsModelInterface>,
	createFilm(filmInfo: FilmModelInterface): Promise<FilmModelInterface>,
	createMeta(metaInfo: FilmDetailsMetaModelInterface, detailsId: number): Promise<any>,

	getFilm(filmId: number): Promise<FilmModelInterface>,
	getFilmsAndCount(data: IGetFilmsAndCount): Promise<IFilmsAndCount>,
	getFilmsByIds(ids: number[]): Promise<IGetFilmsById>,
	getDetails(filmId: number): Promise<FilmDetailsModelInterface>,
	getMeta(filmDetailId: number, limit: number): Promise<FilmDetailsMetaModelInterface>,

	updateFilm(filmInfo: FilmModelInterface, filmId: number): Promise<void>
	updateFilmDetails(detailsInfo: FilmDetailsModelInterface, filmId: number): Promise<void>
	updateMeta(metaInfo: FilmDetailsMetaModelInterface, filmDetailId: number): Promise<void>

	checkFilmByTitle(title: string): Promise<ICheckFilmByTitle | null>
}
