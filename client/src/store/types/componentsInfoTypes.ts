export interface IInitialState {
	header: {
		height: number
	}
}

export enum componentsInfoActionTypesEnum {
	// eslint-disable-next-line no-unused-vars
	SET_HEADER_HEIGHT = 'SET_HEADER_HEIGHT'
}

export interface IHeaderHeightAction {
	type: componentsInfoActionTypesEnum.SET_HEADER_HEIGHT,
	payload: number
}
