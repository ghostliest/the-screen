export type folderType = 'watchLater' | 'favorite' | 'viewed'

// --- userApi ---
export interface ILogin {
	canAuthorize: boolean,
	token: string,
	message: string
}

export interface IRegistration extends ILogin { }

// --- contentApi ---
export type TypeSearchMini = 'all' | 'film' | 'director' | 'actor' | 'country' | 'genre'
export type TypeSearchFull = 'all' | 'film'
export type TypeGetMeta = 'director' | 'actor' | 'country' | 'genre'
export type TypeSort = 'popular' | 'rating' | 'date'
export type TypeContentType = 'all' | 'film' | 'series'

export interface IQuery {
	limit?: number,
	page?: number,
	type: TypeContentType,
	sort?: TypeSort,
	country: number,
	genre: number,
	year: string
}
