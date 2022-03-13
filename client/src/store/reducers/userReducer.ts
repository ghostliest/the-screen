import { UserActionTypesEnum, UserInterface } from '../types/userTypes'

const initialState = {
	user: {} as UserInterface,
	isAuth: false,
	isAdmin: false,
	isLoading: true
}

const userReducer = (state = initialState, { type, payload }: any) => {
	switch (type) {
	case UserActionTypesEnum.SET_USER:
		return { ...state, user: payload }
	case UserActionTypesEnum.SET_ADMIN:
		return { ...state, isAdmin: payload }
	case UserActionTypesEnum.SET_AUTH:
		return { ...state, isAuth: payload }
	case UserActionTypesEnum.SET_LOGOUT:
		return { ...state, user: {}, isAuth: false, isAdmin: false }
	case UserActionTypesEnum.SET_LOADING:
		return { ...state, isLoading: payload }
	default:
		return { ...state }
	}
}

export default userReducer
