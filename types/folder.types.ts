export interface IFolderContent {
	id: number,
	title: string,
	year: number,
	img: string,
	isFilm: boolean,
	completionYear: null,
	added: string,
	rating: {
		ratingsCount: number,
		starsCount: number,
		userRating: number
	},
	details: {
		duration: number
	},
	directors: IMeta[],
	actors: IMeta[],
	countries: IMeta[],
	genres: IMeta[]
}

interface IMeta {
	id: number,
	value: string
}

export interface IFolderContentFull {
	count: number,
	rows: IFolderContent[]
}