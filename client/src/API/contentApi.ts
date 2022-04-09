import { fetchWrapper } from './fetchWrapper'
import { IFullContent, ISearchRes } from '../store/types/contentTypes'
import { IQuery, TypeGetMeta, TypeSearchFull, TypeSearchMini } from './types'

export const getFullContent = async (id: string): Promise<IFullContent> => {
	return await fetchWrapper({
		url: `${process.env.REACT_APP_API_URL}/api/film/${id}`
	})
}

export const getContent = async ({ page = 1, limit = 2, type = 'all', sort = 'popular',	country = 0, genre = 0,	year = '' }: IQuery): Promise<any> => {
	return await fetchWrapper({
		url: `${process.env.REACT_APP_API_URL}/api/film/get-all?page=${page}&limit=${limit}&type=${type}&sort=${sort}&country=${country}&genre=${genre}&year=${year}`
	})
}

export const getAllByIds = async (ids: string): Promise<any> => {
	return fetchWrapper({
		url: `${process.env.REACT_APP_API_URL}/api/film/get-all-by-ids?ids=${ids}`
	})
}

export const getMeta = async (type: TypeGetMeta, limit: number = 5, page: number = 1): Promise<Array<{id: number, value: string}>> => {
	return await fetchWrapper({
		url: `${process.env.REACT_APP_API_URL}/api/get-meta/${type}/?limit=${limit}`
	})
}

export const searchContent = async (type: TypeSearchFull, value: string): Promise<ISearchRes> => {
	return await fetchWrapper({
		url: `${process.env.REACT_APP_API_URL}/api/search/${type}/?value=${value}`
	})
}

export const search = async (type: TypeSearchMini, search: string, limit: number = 5): Promise<{[key: string]: []}> => {
	return await fetchWrapper({
		url: `${process.env.REACT_APP_API_URL}/api/search/${type}/?value=${search}&limit=${limit}`
	})
}

export const create = async (formData: any) => {
	return await fetchWrapper({
		url: `${process.env.REACT_APP_API_URL}/api/film/create`,
		method: 'POST',
		needToken: true,
		body: formData
	})
}

export const update = async (formData: any, filmId: number) => {
	return await fetchWrapper({
		url: `${process.env.REACT_APP_API_URL}/api/film/${filmId}`,
		method: 'PUT',
		needToken: true,
		body: formData
	})
}
