import {
	ContentActionTypesEnum,
	IFilmsAndCount,
	IFullContent,
	IInitialContentState,
	IMiniContent
} from '../types/contentTypes'

const miniContentInitial: IMiniContent = {
	id: 0,
	title: '',
	img: '',
	completionYear: null,
	isFilm: true,
	year: 0,
	details: {
		youtubeTrailerKey: '',
		seasonCount: null
	},
	rating: {
		ratingsCount: 0,
		starsCount: 0
	}
}

export const fullContentInitial: IFullContent = {
	...miniContentInitial,
	details: {
		ageRating: 0,
		description: '',
		duration: 0,
		youtubeTrailerKey: '',
		seasonCount: null
	},
	actors: [{ id: 0, value: '' }],
	countries: [{ id: 0, value: '' }],
	directors: [{ id: 0, value: '' }],
	genres: [{ id: 0, value: '' }]
}

const contentInitial: IFilmsAndCount = {
	count: 0,
	rows: [{
		id: 0,
		title: '',
		year: 0,
		img: '',
		isFilm: true,
		completionYear: null,
		ratingsCount: 0,
		starsCount: 0,
		youtubeTrailerKey: ''
	}]
}

const initialState: IInitialContentState = {
	isLoading: true,
	trailer: {
		isShowTrailer: false,
		trailerKey: ''
	},
	films: contentInitial,
	selected: {
		current: fullContentInitial,
		previous: [miniContentInitial]
	}
}

const contentReducer = (state = initialState, { type, payload }: any): IInitialContentState => {
	switch (type) {
	case 'SET_LOADING':
		return { ...state, isLoading: payload }
	case ContentActionTypesEnum.SET_CONTENT_LIST:
		return { ...state, films: payload }
	case 'SET_CONTENT_SELECTED':
		return { ...state, selected: { ...state.selected, current: payload } }
	case 'SET_CONTENT_PREVIOUS':
		return { ...state, selected: { ...state.selected, previous: [...state.selected.previous, payload] } }
	case 'CLEAR_CONTENT_SELECTED':
		return { ...state, selected: { ...state.selected, current: fullContentInitial } }
	case ContentActionTypesEnum.SET_SHOW_TRAILER:
		return { ...state, trailer: payload }
	default:
		return { ...state }
	}
}

export default contentReducer
