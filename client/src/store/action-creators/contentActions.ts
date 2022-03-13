import { ContentActionTypesEnum, ITrailer, TrailerAction } from '../types/contentTypes'

export const setTrailer = (value: ITrailer): TrailerAction => {
	return {
		type: ContentActionTypesEnum.SET_SHOW_TRAILER,
		payload: value
	}
}
