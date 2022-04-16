import { IHeaderHeightAction, componentsInfoActionTypesEnum } from '../types/componentsInfoTypes'

export const setHeaderHeight = (value: number): IHeaderHeightAction => {
	return {
		type: componentsInfoActionTypesEnum.SET_HEADER_HEIGHT,
		payload: value
	}
}
