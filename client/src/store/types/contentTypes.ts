import { IFilmsAndCount } from '../../../../server/interfaces/services/IFilmService'
/* eslint-disable no-unused-vars */
export interface IInitialContentState {
	isLoading: boolean,
	trailer: ITrailer,
	films: IFilmsAndCount,
	selected: {
		current: IFullContent,
		previous: IMiniContent[]
	}
}

export interface ITrailer {
	isShowTrailer: boolean,
	trailerKey: string
}

export interface ISearchRes {
	films: IMiniContent[],
	persons: IMetaItem[],
	message: string
}

export interface IFullContent extends IMiniContent {
	actors: IMetaItem[],
	countries: IMetaItem[],
	directors: IMetaItem[],
	genres: IMetaItem[]
	details: IContentDetails,
}

export interface IMiniContentWithQuantity {
	count: number,
	rows: IMiniContent[]
}

export interface IMiniContent {
	id: number,
	title: string,
	year: number,
	img: string,
	isFilm: boolean,
	completionYear: number | null,
	rating: {
		ratingsCount: number,
		starsCount: number,
	},
	details: { youtubeTrailerKey: string } | IContentDetails,
}

interface IContentDetails {
	ageRating: number,
	duration: number,
	description: string,
	youtubeTrailerKey: string
	seasonCount: null | number
}

export interface IMetaItem {
	id: number,
	value: string
}

export enum ContentActionTypesEnum {
	SET_CONTENT_LIST = 'SET_CONTENT_LIST',
	SET_SHOW_TRAILER = 'SET_SHOW_TRAILER'
}

// export interface typeItem {
// 	id: number | null, name: string
// }

export interface TrailerAction {
	type: ContentActionTypesEnum.SET_SHOW_TRAILER,
	payload: ITrailer
}
