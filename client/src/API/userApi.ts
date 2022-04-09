import { fetchWrapper } from './fetchWrapper'
import { IFolderContentFull } from '../../../types/folder.types'
import { folderType, ILogin, IRegistration } from './types'

export const login = async (body: { email?: string, password?: string }): Promise<ILogin> => {
	return fetchWrapper({
		url: `${process.env.REACT_APP_API_URL}/api/user/login`,
		method: 'POST',
		body
	})
}

export const registration = async (body: { email?: string, userName?: string, password?: string }): Promise<IRegistration> => {
	return fetchWrapper({
		url: `${process.env.REACT_APP_API_URL}/api/user/registration`,
		method: 'POST',
		body
	})
}

export const checkAuth = async () => {
	return await fetchWrapper({
		url: `${process.env.REACT_APP_API_URL}/api/user/auth`,
		method: 'GET',
		needToken: true
	})
}

export const getFolderContent = async (folder: folderType, page: number = 1, limit: number = 5, count?: number): Promise<IFolderContentFull> => {
	return fetchWrapper({
		url: `${process.env.REACT_APP_API_URL}/api/user/folder/${folder}?page=${page}&limit=${limit}&count=${count}`,
		method: 'GET',
		needToken: true
	})
}

export const addToFolder = async (folder: folderType, filmId: number): Promise<{ operation: 'add' | 'remove' }> => {
	return fetchWrapper({
		url: `${process.env.REACT_APP_API_URL}/api/user/folder/${folder}`,
		method: 'POST',
		needToken: true,
		body: { filmId: filmId }
	})
}

export const CheckInFolder = async (folder: folderType, filmId: number) => {
	return fetchWrapper({
		url: `${process.env.REACT_APP_API_URL}/api/user/folder/check/?name=${folder}&filmId=${filmId}`,
		method: 'GET',
		needToken: true
	})
}

export const addUserRate = (body: { filmId: number, rating: number }): Promise<{ message: 'OK' }> => {
	return fetchWrapper({
		url: `${process.env.REACT_APP_API_URL}/api/user/rate`,
		method: 'POST',
		needToken: true,
		body
	})
}

export const checkRate = (filmId: number): Promise<{ rate: number, message: 'none' }> => {
	return fetchWrapper({
		url: `${process.env.REACT_APP_API_URL}/api/user/rate?filmId=${filmId}`,
		method: 'GET',
		needToken: true
	})
}
