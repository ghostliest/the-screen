import { UserActionTypesEnum, UserInterface, UserActionInterface, AdminActionInterface, AuthActionInterface, LoadingActionInterface } from '../types/userTypes'

export const setUser = (value: UserInterface): UserActionInterface => {
	return {
		type: UserActionTypesEnum.SET_USER,
		payload: value
	}
}

export const setIsAdmin = (value: boolean): AdminActionInterface => {
	return {
		type: UserActionTypesEnum.SET_ADMIN,
		payload: value
	}
}

export const setIsAuth = (value: boolean): AuthActionInterface => {
	return {
		type: UserActionTypesEnum.SET_AUTH,
		payload: value
	}
}

export const setLogout = (): any => {
	return {
		type: UserActionTypesEnum.SET_LOGOUT
	}
}

export const setLoading = (value: boolean): LoadingActionInterface => {
	return {
		type: UserActionTypesEnum.SET_LOADING,
		payload: value
	}
}
