import { IInitialState, componentsInfoActionTypesEnum } from '../types/componentsInfoTypes'

const initialState: IInitialState = {
	header: {
		height: 0
	}
}

const componentsInfoReducer = (state = initialState, { type, payload }: any): IInitialState => {
	switch (type) {
	case componentsInfoActionTypesEnum.SET_HEADER_HEIGHT:
		return { ...state, header: { height: payload } }
	default:
		return { ...state }
	}
}

export default componentsInfoReducer
