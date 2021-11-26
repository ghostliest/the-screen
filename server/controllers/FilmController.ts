import { Request, Response, NextFunction } from "express";
import sequelize from '../db';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { Film, FilmDetails, FilmRating, Upcoming } from "../models/models";
import ApiError from '../error/ApiError';
import { FilmDetailsMetaModelInterface, FilmDetailsModelInterface, FilmModelInterface, FilmRatingInterface } from '../types/filmsTypes';
import BaseController from './BaseController';
import CustomRequest from '../types/customRequest';

class FilmController extends BaseController {
	constructor() {
		super();
		this.create = this.create.bind(this);
		this.update = this.update.bind(this);
		this.getOne = this.getOne.bind(this);
		this.infoDestruction = this.infoDestruction.bind(this);
		this.createImg = this.createImg.bind(this);
		this.addUpcoming = this.addUpcoming.bind(this);
	}

	public async create(req: Request, res: Response, next: NextFunction) {
		try {
			const filmCheck = await Film.findOne({
				where: { title: JSON.parse(req.body.title) },
				attributes: ["id", "title"],
				raw: true
			});
			if (filmCheck) throw new Error(`Film with title '${filmCheck.title}' already exists`);
			if (!req.files?.img) throw new Error("No image");

			const filename = await this.createImg(req.files?.img);
			const { filmInfo, detailsInfo, metaInfo }: {
				filmInfo: FilmModelInterface,
				detailsInfo: FilmDetailsModelInterface,
				metaInfo: FilmDetailsMetaModelInterface
			} = await this.infoDestruction(req, filename);

			const result = await this.createRecords(filmInfo, detailsInfo, metaInfo);
			return res.json(result);
		} catch (e: any) {
			console.log(e.message);
			next(ApiError.badRequest(e.message))
		}
	}

	private async infoDestruction(req: Request, filename: string | undefined): Promise<any> {
		const keys = Object.keys(req.body);
		for (let i = 0; i < keys.length; i++) {
			req.body[keys[i]] = JSON.parse(req.body[keys[i]]);
		}

		return {
			filmInfo: {
				title: req.body.title,
				year: req.body.year,
				completionYear: req.body.completionYear,
				img: filename,
				isFilm: req.body.isFilm
			} as FilmModelInterface,
			detailsInfo: {
				ageRating: req.body.ageRating,
				duration: req.body.duration,
				description: req.body.description,
				seasonCount: req.body.seasonCount,
				youtubeTrailerKey: req.body.youtubeTrailerKey
			} as FilmDetailsModelInterface,
			metaInfo: {
				actor: req.body.actors,
				director: req.body.directors,
				genre: req.body.genres,
				country: req.body.countries
			} as unknown as FilmDetailsMetaModelInterface
		}
	}

	private async createImg(img: any) {
		const filename: string = `${uuidv4()}.jpg`;
		await img.mv(path.resolve(__dirname, '..', 'static', filename));
		return filename;
	}

	private async createRecords(filmInfo: FilmModelInterface, detailsInfo: FilmDetailsModelInterface, metaInfo: FilmDetailsMetaModelInterface): Promise<object> {
		const film = (await Film.create(filmInfo)).get({ plain: true });
		const details = await FilmDetails.create({ ...detailsInfo, filmId: film.id }, { raw: true });

		const metaKeys = Object.keys(metaInfo);
		for (let i = 0; i < metaKeys.length; i++) {
			const curMetaEl: Array<any> = metaInfo[metaKeys[i]];
			for (let j = 0; j < curMetaEl.length; j++) {
				await sequelize.query(
					`INSERT INTO "${"film-detail_" + this.endPoints[metaKeys[i]].table}"`
					+ ` ("id", "${metaKeys[i] + 'Id'}", "filmDetailId", "createdAt", "updatedAt")`
					+ ` VALUES (DEFAULT, ${curMetaEl[j]}, ${details.id}, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))`
				)
			}
		}

		await FilmRating.create({ ratingsCount: 0, starsCount: 0, filmId: film.id });
		return { ...film, details, metaInfo }
	}

	public async update(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			let filename: string | undefined;
			const bodyLength = Object.keys(req.body).length;

			if (!bodyLength && !req.files) {
				throw new Error("You haven't changed any of the fields");
			}

			if (req.files) {
				filename = await this.createImg(req.files.img);
				const oldImg: any = await Film.findOne({ where: { id } });
				fs.unlink(`${__dirname}/../static/${oldImg.img}`, (e) => e);
			} else {
				filename = undefined;
			}

			const { filmInfo, detailsInfo, metaInfo }: {
				filmInfo: FilmModelInterface,
				detailsInfo: FilmDetailsModelInterface,
				metaInfo: FilmDetailsMetaModelInterface
			} = await this.infoDestruction(req, filename);

			await Film.update(filmInfo, { where: { id } });
			await FilmDetails.update(detailsInfo, { where: { filmId: id } });
			const details = await FilmDetails.findOne({
				where: { filmId: id }, raw: true, attributes: ["id"]
			}) as { id: number } as FilmDetailsModelInterface;

			const metaKeys = Object.keys(metaInfo);
			for (let i = 0; i < metaKeys.length; i++) {
				if (!metaInfo[metaKeys[i]]) continue;
				const metaMethodsKeys: Array<string> = Object.keys(metaInfo[metaKeys[i]]);
				const methods: { [key: string]: [] } = metaInfo[metaKeys[i]];
				const tableName = "film-detail_" + this.endPoints[metaKeys[i]].table;
				const colMetaPK = metaKeys[i] + "Id";
				const colDetailPK = "filmDetailId";

				for (let j = 0; j < metaMethodsKeys.length; j++) {
					const curValOfMethod: Array<any> = methods[metaMethodsKeys[j]];
					const curMethod: string = metaMethodsKeys[j];

					for (let k = 0; k < curValOfMethod.length; k++) {
						if (curMethod === "replace") {
							await sequelize.query(
								`UPDATE "${tableName}" SET "${colMetaPK}" = ${curValOfMethod[k][1]}`
								+ ` WHERE "${colDetailPK}" = ${details.id} AND "${colMetaPK}" = ${curValOfMethod[k][0]}`
							)
						} else if (curMethod === "delete") {
							await sequelize.query(
								`DELETE FROM "${tableName}"`
								+ ` WHERE "${colDetailPK}" = ${details.id} AND "${colMetaPK}" = ${curValOfMethod[k]}`
							);
						} else if (curMethod === "add") {
							await sequelize.query(
								`INSERT INTO "${tableName}"`
								+ ` ("id", "${colDetailPK}", "${colMetaPK}", "createdAt", "updatedAt")`
								+ ` VALUES (DEFAULT, ${details.id}, ${curValOfMethod[k]}, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))`
							);
						}
					}
				}
			}

			return res.json({ message: "Data updated" })
		} catch (e: any) {
			console.log(e.message)
			next(ApiError.badRequest(e.message))
		}
	}

	public async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			let { page, limit, isFilm }: any = req.query;
			page = page || 1;
			limit = limit || 20;
			const offset = page * limit - limit;
			const where: any = {};

			if (isFilm !== undefined) {
				isFilm = JSON.parse(isFilm);
				where.isFilm = isFilm;
			}

			const films = await Film.findAndCountAll({
				where, limit, offset,
				attributes: ["id", "title", "year", "img", "isFilm", "completionYear"],
				order: [["id", "ASC"]],
				include: [{
					model: FilmRating,
					as: "rating",
					attributes: ["ratingsCount", "starsCount"],
				}]
			});

			return res.json(films)
		} catch (e: any) {
			console.log(e.message)
			next(ApiError.badRequest(e.message))
		}
	}

	public async getOne(req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;

			const film = await sequelize.query(
				`SELECT "id", "title", "year", "img", "isFilm", "completionYear" FROM films WHERE id = ${id}`,
				{ plain: true }
			) as unknown as FilmModelInterface;

			const rating = await sequelize.query(
				`SELECT "ratingsCount", "starsCount" FROM "film-ratings" WHERE "filmId" = ${id}`,
				{ plain: true }
			) as unknown as FilmRatingInterface;

			const details = await sequelize.query(
				`SELECT "id", "ageRating", "duration", "description", "youtubeTrailerKey", "seasonCount"`
				+ ` FROM "film-details" WHERE "filmId" = ${id}`,
				{ plain: true }
			) as unknown as FilmDetailsModelInterface;

			const meta = {} as FilmDetailsMetaModelInterface;
			const keys = Object.keys(this.endPoints);
			for (let i = 0; i < keys.length - 1; i++) {
				const tmp = this.endPoints[keys[i]];

				const metaKeys = await sequelize.query(
					`SELECT ARRAY(SELECT "${keys[i] + "Id"}" FROM "${"film-detail_" + tmp.table}" WHERE "filmDetailId" = ${details.id})`,
					{ plain: true }
				) as { array: [number] };

				const metaValues = await sequelize.query(
					`SELECT ARRAY(SELECT "${tmp.col}" FROM "${tmp.table}" WHERE "id" = ANY(ARRAY[${metaKeys.array}]))`,
					{ plain: true }
				) as { array: [string] };

				meta[tmp.table] = metaValues.array;

				console.log("\x1b[30m", "\x1b[43m", "metaKeys:", "\x1b[0m", metaKeys);
				console.log("\x1b[30m", "\x1b[43m", "metaValues:", "\x1b[0m", metaValues);
			}
			console.log("\x1b[30m", "\x1b[43m", "meta:", "\x1b[0m", meta);

			delete details.id;
			const result = { ...film, rating, ...details, ...meta };
			if (req.local) return result;
			return res.json(result)
		} catch (e: any) {
			console.log(e.message)
			next(ApiError.badRequest(e.message))
		}
	}

	public async addUpcoming(req: Request, res: Response, next: NextFunction) {
		try {
			const { filmId } = req.body;
			if (!filmId || !req.files?.img) throw new Error('Not all fields are filled');
			const filmInclude = await Upcoming.findOne({ where: { filmId }, raw: true });
			if (filmInclude) throw new Error('Already exists');

			const film = await Film.findOne({
				where: { id: filmId }, raw: true, attributes: ["title"]
			}) as FilmModelInterface;

			const filename = await this.createImg(req.files?.img);
			await Upcoming.create({ filmId, img: filename });

			return res.json({ message: `Film '${film.title}' added to 'Upcoming'.` })
		} catch (e: any) {
			console.log(e.message)
			next(ApiError.badRequest(e.message))
		}
	}

	public async deleteUpcoming(req: Request, res: Response, next: NextFunction) {
		try {
			const { filmId } = req.body;

			if (!filmId) throw new Error('Not all fields are filled');
			const filmUpcoming: any = await Upcoming.findOne({ where: { filmId } });
			if (!filmUpcoming) throw new Error('The film does not exist');
			fs.unlink(`${__dirname}/../static/${filmUpcoming.img}`, (e) => e);
			await Upcoming.destroy({ where: { filmId } });

			const film = await Film.findOne({
				where: { id: filmId }, raw: true, attributes: ["title"]
			}) as FilmModelInterface;

			return res.json({ message: `Film '${film.title}' removed to 'Upcoming'.` })
		} catch (e: any) {
			console.log(e.message)
			next(ApiError.badRequest(e.message))
		}
	}
}

export default new FilmController();