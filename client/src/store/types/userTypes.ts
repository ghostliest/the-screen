export interface UserFullInterface {
	user: UserInterface,
	isAuth: boolean,
	isAdmin: boolean,
	isLoading: boolean
}

export enum UserActionTypesEnum {
	// eslint-disable-next-line no-unused-vars
	SET_USER = 'SET_USER',
	// eslint-disable-next-line no-unused-vars
	SET_ADMIN = 'SET_ADMIN',
	// eslint-disable-next-line no-unused-vars
	SET_AUTH = 'SET_AUTH',
	// eslint-disable-next-line no-unused-vars
	SET_LOADING = 'SET_LOADING',
	// eslint-disable-next-line no-unused-vars
	SET_LOGOUT = 'SET_LOGOUT'
}

export interface UserInterface {
	id: number,
	email: string,
	role: 'USER' | 'ADMIN'
}

export interface UserActionInterface {
	type: UserActionTypesEnum.SET_USER
	payload: UserInterface
}

export interface AdminActionInterface {
	type: UserActionTypesEnum.SET_ADMIN
	payload: boolean
}

export interface AuthActionInterface {
	type: UserActionTypesEnum.SET_AUTH
	payload: boolean
}

export interface LoadingActionInterface {
	type: UserActionTypesEnum.SET_LOADING
	payload: boolean
}
