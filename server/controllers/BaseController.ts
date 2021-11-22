import { Op } from "sequelize";
import { Request, Response, NextFunction } from 'express';
import sequelize from '../db';
import ApiError from '../error/ApiError';
import { Film, FilmRating } from '../models/models';

class BaseController {
	protected endPoints: { [key: string]: { table: string, col: string } } = {
		director: { table: "directors", col: "name" },
		actor: { table: "actors", col: "name" },
		country: { table: "countries", col: "country" },
		genre: { table: "genres", col: "genre" },
		film: { table: "films", col: "title" },
	};

	constructor() {
		this.search = this.search.bind(this);
		this.create = this.create.bind(this);
	}

	public async search(req: Request, res: Response, next: NextFunction) {
		try {
			const { query }: { query: string } = req.query as any;
			const endPoint = req.params.name;
			const search = query[0].toUpperCase() + query.slice(1);

			console.log("\x1b[30m", "\x1b[43m", "params:", "\x1b[0m", req.params.name);
			console.log("\x1b[30m", "\x1b[43m", "search:", "\x1b[0m", search);

			if (endPoint === undefined) {
				const result: any = {};
				const films = await Film.findAll({
					where: { title: { [Op.like]: `${search}%` } },
					limit: 5,
					attributes: ["id", "title", "year", "img", "isFilm", "completionYear"],
					include: [
						{
							model: FilmRating,
							as: "rating",
							attributes: ["ratingsCount", "starsCount"]
						}
					],
				});
				result.films = films;

				const keys = Object.keys(this.endPoints).slice(0, 2);
				for (let i = 0; i < keys.length; i++) {
					const [temp] = await sequelize.query(
						`SELECT id, ${this.endPoints[keys[i]].col}`
						+ ` FROM ${this.endPoints[keys[i]].table}`
						+ ` WHERE ${this.endPoints[keys[i]].col}`
						+ ` LIKE '${search}%' LIMIT 5`
					);
					result[`${this.endPoints[keys[i]].table}`] = temp
				}

				return res.json(result);
			} else {
				const result: any = {}
				const [temp] = await sequelize.query(
					`SELECT id, ${this.endPoints[endPoint].col}`
					+ ` FROM ${this.endPoints[endPoint].table}`
					+ ` WHERE ${this.endPoints[endPoint].col}`
					+ ` LIKE '${search}%'`
				)
				result[`${this.endPoints[endPoint].table}`] = temp;

				console.log("\x1b[30m", "\x1b[43m", "result:", "\x1b[0m", result);
				return res.json(result);
			}
		} catch (e: any) {
			console.log(e.message);
			next(ApiError.badRequest(e.message));
		}
	}

	public async create(req: Request, res: Response, next: NextFunction) {
		try {
			const endPoint = req.params.name;
			const { name }: { name: string } = req.query as any;
			const tmp = name.trim().split(" ");
			if (tmp.length < 2 || tmp.length > 3) throw new Error("Check the correctness of the entered data");

			const processedNameArr = [];
			for (let i = 0; i < tmp.length; i++) {
				processedNameArr.push(tmp[i][0].toUpperCase() + tmp[i].slice(1).toLowerCase())
			}
			const processedName = processedNameArr.join(" ");

			const [isExist] = await sequelize.query(
				`SELECT id FROM ${this.endPoints[endPoint].table} WHERE ${this.endPoints[endPoint].col} = '${processedName}'`
			);

			const result = { message: `${endPoint[0].toUpperCase() + endPoint.slice(1)} '${processedName}'` };

			if (isExist.length === 0) {
				await sequelize.query(
					`INSERT INTO ${this.endPoints[endPoint].table}`
					+ ` ("id", "${this.endPoints[endPoint].col}", "createdAt", "updatedAt")`
					+ ` VALUES (DEFAULT, '${processedName}', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))`
				);
				result.message += " added"
			} else {
				result.message += " already exists"
			}

			return res.json(result);
		} catch (e: any) {
			console.log(e.message);
			next(ApiError.badRequest(e.message));
		}
	}
}

export default BaseController;