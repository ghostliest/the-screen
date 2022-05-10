import { Request, Response, NextFunction } from 'express'

export interface IQueryGetAllFilms {
	limit: number,
	page: number,
	type: 'all' | 'film' | 'series',
	sort: 'popular' | 'rating' | 'date',
	country: number,
	genre: number,
	year: string
}

export interface IFilmController {
	create(req: Request<{}, {}, { title: string }>, res: Response, next: NextFunction): Promise<any>,
	update(req: Request, res: Response, next: NextFunction): Promise<any>,
	getOne(req: Request, res: Response, next: NextFunction): Promise<any>,
	getAll({ query }: Request<{}, {}, {}, IQueryGetAllFilms>, res: Response, next: NextFunction): Promise<any>,
	getAllByIds(req: Request, res: Response, next: NextFunction): Promise<any>
}
