import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import sequelize from '../db';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ApiError from "../error/ApiError";
import { User, UserRating } from "../models/models";
import { UserModelInterface } from '../types/userTypes';
import CustomRequest from '../types/customRequest';
import FilmController from './FilmController';
import { FullFilmModelInterface } from '../types/filmsTypes';

class UserController {
	private folders: string[] = ["watchLater", "favorite", "viewed"];
	private defineTables = {
		filmRatings: {
			table: "film-ratings",
			cols: { ratingsCount: "ratingsCount", starsCount: "starsCount", filmId: "filmId" }
		}
	};

	constructor() {
		this.generateJwt = this.generateJwt.bind(this);
		this.registration = this.registration.bind(this);
		this.login = this.login.bind(this);
		this.check = this.check.bind(this);
		this.update = this.update.bind(this);
		this.delete = this.delete.bind(this);
		this.addUserRate = this.addUserRate.bind(this);
		this.getFolder = this.getFolder.bind(this);
	}

	public async registration(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, username, password } = req.body;

			if (!email || !username || !password) {
				return next(ApiError.badRequest("Not all fields are filled"));
			}

			const candidate = await User.findOne({
				where: { [Op.or]: [{ email }, { username }] },
				attributes: ["email", "username"],
				raw: true
			});

			if (candidate?.email === email && candidate?.username === username) {
				return next(ApiError.badRequest("User with such email and username already exists"));
			} else if (candidate?.email === email) {
				return next(ApiError.badRequest("User with such email already exists"));
			} else if (candidate?.username === username) {
				return next(ApiError.badRequest("User with such username already exists"));
			}

			const hashPassword = await bcrypt.hash(password, 5);
			const user = await User.create({ email, username, password: hashPassword });

			for (let i = 0; i < this.folders.length; i++) {
				await sequelize.query(
					`INSERT INTO "${this.folders[i] + "s"}"`
					+ ` ("id", "createdAt", "updatedAt", "userId")`
					+ ` VALUES(DEFAULT, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), ${user.id})`
				)
			}

			const token = this.generateJwt(user.id, user.email, user.role);
			return res.json({ token })
		} catch (e: any) {
			console.log(e.message);
			next(ApiError.badRequest(e.message))
		}
	}

	public async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { email, password } = req.body;
			const user = await User.findOne({ where: { email }, raw: true, attributes: ["id", "email", "password", "role"] });
			if (!user) {
				return next(ApiError.badRequest("User with such email doesn't exist"))
			}
			const comparePassword = await bcrypt.compare(password, user!.password)
			if (!comparePassword) {
				return next(ApiError.badRequest("Invalid password"));
			}
			const token = this.generateJwt(user!.id, user!.email, user!.role)
			return res.json({ token })
		} catch (e: any) {
			console.log(e.message);
			next(ApiError.badRequest(e.message))
		}
	}

	public async check(req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const token = this.generateJwt(req.user.id, req.user.email, req.user.role);
			res.json({ token });
		} catch (e: any) {
			console.log(e.message);
			next(ApiError.badRequest(e.message))
		}
	}

	public async delete(req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const { email } = req.user;
			const user = await User.findOne({ where: { email }, }) as UserModelInterface;

			for (let i = 0; i < this.folders.length; i++) {
				const [[folder]]: any = await sequelize.query(`
					SELECT "id" FROM "${this.folders[i] + "s"}" WHERE "userId" = ${user.id}
				`);

				if (!folder) {
					continue;
				} else {
					await sequelize.query(
						`DELETE FROM "${this.folders[i] + "_films"}" WHERE "${this.folders[i] + "Id"}" = ${folder.id}
					`);
					await sequelize.query(
						`DELETE FROM "${this.folders[i] + "s"}" WHERE "userId" = ${user.id}
					`);
				}
			}

			await sequelize.query(`DELETE FROM "users" WHERE "email" = '${user.email}'`);

			return res.json({ message: "Account deleted" });
		} catch (e: any) {
			console.log(e.message);
			next(ApiError.badRequest(e.message))
		}
	}

	public async update(req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const { username, password } = req.body;
			const email = req.user.email;

			const user = await User.findOne({ where: { email } });
			if (!user) return next(ApiError.badRequest("User not found"));

			const isPassword = await bcrypt.compare(password, user.password);

			if (user.username === username && isPassword) {
				return next(ApiError.badRequest("The new username and password cannot match the old one"));
			} else if (user.username === username) {
				return next(ApiError.badRequest("The new username cannot match the old one"));
			} else if (isPassword) {
				return next(ApiError.badRequest("The new user password cannot match the old one"));
			}

			const hashPassword = await bcrypt.hash(password, 5);
			await User.update({ username, password: hashPassword }, { where: { email } });
			const token = this.generateJwt(user.id, user.email, user.role);

			return res.json({ token });
		} catch (e: any) {
			console.log(e.message);
			next(ApiError.badRequest(e.message))
		}
	}

	private generateJwt(id: number, email: string, role: string): string {
		return jwt.sign(
			{ id, email, role },
			`${process.env.SECRET_KEY}`,
			{ expiresIn: "24h" }
		)
	}

	public async addToFolder(req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const folderName = req.params.name;
			const { filmId } = req.body;
			const userId = req.user.id;

			if (!filmId) return next(ApiError.badRequest("Film is not specified"));

			const [[folder]]: any = await sequelize.query(
				`SELECT "id" FROM "${folderName + "s"}" WHERE "userId" = ${userId}`
			);

			const [filmInclude] = await sequelize.query(
				`SELECT "filmId" FROM "${folderName + "_films"}"`
				+ ` WHERE "${folderName + "Id"}" = ${folder.id}`
				+ ` AND "${folderName + "_films"}"."filmId" = ${filmId}`
			);

			if (filmInclude.length === 0) {
				await sequelize.query(
					`INSERT INTO "${folderName + "_films"}" ("id", "createdAt", "updatedAt", "${folderName + "Id"}", "filmId")`
					+ ` VALUES (DEFAULT, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), ${folder.id}, ${filmId})`
				);
				return res.json({ message: `Added to playlist '${folderNameBeautifier(folderName)}'.` })
			} else {
				await sequelize.query(
					`DELETE FROM "${folderName + "_films"}" WHERE "${folderName + "Id"}" = ${folder.id} AND "filmId" = ${filmId}`
				);
				return res.json({ message: `Removed from playlist '${folderNameBeautifier(folderName)}'.` })
			}

			function folderNameBeautifier(string: string) {
				const arrString = string.split(/(?=[A-Z])/);
				if (arrString.length > 0) {
					const arr = []
					for (let i = 0; i < arrString.length; i++) {
						if (i === 0) {
							arr.push(arrString[i][0].toUpperCase() + arrString[i].slice(1))
						} else {
							arr.push(arrString[i][0].toLowerCase() + arrString[i].slice(1))
						}
					}
					return arr.join(" ")
				}
			}
		} catch (e: any) {
			console.log(e.message);
			next(ApiError.badRequest(e.message))
		}
	}

	public async getFolder(req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const folderName = req.params.name;
			const { id } = req.user;

			const folder = await sequelize.query(
				`SELECT "id" FROM "${folderName + "s"}" WHERE "userId" = ${id}`,
				{ plain: true }
			) as { id: number };

			const filmsId = await sequelize.query(
				`SELECT ARRAY(SELECT "filmId" FROM "${folderName + "_films"}" WHERE "${folderName + "Id"}" = ANY(ARRAY[${folder.id}]))`,
				{ plain: true }
			) as { array: string[] };

			const films: { [filmId: string]: FullFilmModelInterface } = {};

			for (let i = 0; i < filmsId.array.length; i++) {
				const filmId = filmsId.array[i];
				const film = await FilmController.getOne(
					{ ...req, params: { id: filmId }, local: true } as any, res, next
				) as unknown as FullFilmModelInterface;

				const userRate = await sequelize.query(
					`SELECT "rating" FROM "user-ratings" WHERE "filmId" = ${filmId} AND "userId" = ${id}`,
					{ plain: true }
				) as { rating: number };

				if (folderName !== this.folders[0]) {
					film.rating.userRating = userRate?.rating;
				}
				delete film.description;
				film.actors = film.actors.slice(0, 3);
				films[film.id!] = film;
			}

			console.log("\x1b[30m", "\x1b[43m", "folderId:", "\x1b[0m", folder);
			console.log("\x1b[30m", "\x1b[43m", "filmsId:", "\x1b[0m", filmsId.array);
			console.log("\x1b[30m", "\x1b[43m", "films:", "\x1b[0m", films);
			return res.json(films);
		} catch (e: any) {
			console.log(e.message);
			next(ApiError.badRequest(e.message))
		}
	}

	public async addUserRate(req: CustomRequest, res: Response, next: NextFunction) {
		try {
			const { id: userId } = req.user;
			const { filmId, rating }: { filmId: number, rating: number } = req.body;
			if (rating < -1 || rating === 0 || rating > 10) throw new Error("Invalid value");

			const isRate = await UserRating.findOne({
				where: { filmId, userId },
				attributes: ["rating"],
				raw: true
			}) as unknown as { rating: number };

			if (isRate && rating >= 1 || !isRate && rating === -1) throw new Error("Invalid operation");
			const count = rating <= 0 ? -1 : 1;
			const rate = count === -1 ? -isRate.rating : rating;
			const { cols: { ratingsCount, starsCount, filmId: id }, table } = this.defineTables.filmRatings;

			if (isRate && rating === -1) {
				await UserRating.destroy({ where: { filmId, userId } });
			} else if (!isRate && rating >= 1) {
				await UserRating.create({ rating, filmId, userId });
			}

			await sequelize.query(
				`UPDATE "${table}" SET`
				+ ` "${ratingsCount}" = "${ratingsCount}" + ${count},`
				+ ` "${starsCount}" = "${starsCount}" + ${rate},`
				+ ` "updatedAt" = CURRENT_TIMESTAMP(3)`
				+ ` WHERE "${id}" = ${filmId}`
			);

			return res.json({ message: "OK" })
		} catch (e: any) {
			console.log(e.message);
			next(ApiError.badRequest(e.message))
		}
	}
}

export default new UserController();