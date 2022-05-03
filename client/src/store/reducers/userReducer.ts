import { UserActionTypesEnum, UserInterface } from '../types/userTypes'

const initialState: IInitialState = {
	user: null,
	isAuth: false,
	isAdmin: false,
	isLoading: true
}

interface IInitialState {
	user: UserInterface | null,
	isAuth: boolean,
	isAdmin: boolean,
	isLoading: boolean
}

const userReducer = (state = initialState, { type, payload }: any): IInitialState => {
	switch (type) {
	case UserActionTypesEnum.SET_USER:
		return { ...state, user: payload }
	case UserActionTypesEnum.SET_ADMIN:
		return { ...state, isAdmin: payload }
	case UserActionTypesEnum.SET_AUTH:
		return { ...state, isAuth: payload }
	case UserActionTypesEnum.SET_LOGOUT:
		return { ...state, user: null, isAuth: false, isAdmin: false }
	case UserActionTypesEnum.SET_LOADING:
		return { ...state, isLoading: payload }
	default:
		return { ...state }
	}
}

export default userReducer
