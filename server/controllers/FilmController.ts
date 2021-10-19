import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Film, FilmDetails, FilmRating } from "../models/models";
import { FilmDetailsModelInterface, FilmModelInterface } from '../types/filmsTypes';

class FilmController {
	constructor() {
		this.create = this.create.bind(this);
		this.createInfo = this.createInfo.bind(this);
		this.createImg = this.createImg.bind(this);
	}

	public async create(req: Request, res: Response, next: NextFunction) {
		try {
			const filmCheck = await Film.findOne({ where: { title: req.body.title } });
			if (filmCheck) throw new Error(`Film with title '${filmCheck.title}' already exists`);
			if (!req.files?.img) throw new Error("No image");

			const filename = await this.createImg(req.files?.img);
			const { filmInfo, detailsInfo }: { filmInfo: FilmModelInterface, detailsInfo: FilmDetailsModelInterface } = await this.createInfo(req, filename);

			return res.json(await this.createRecords(filmInfo, detailsInfo));
		} catch (e: any) {
			console.log(e.message)
		}
	}

	private async createInfo(req: Request, filename: string | undefined): Promise<any> {
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
			} as FilmDetailsModelInterface
		}
	}

	private async createImg(img: any) {
		const filename: string = `${uuidv4()}.jpg`;
		await img.mv(path.resolve(__dirname, '..', 'static', filename))
		return filename;
	}

	private async createRecords(filmInfo: FilmModelInterface, detailsInfo: FilmDetailsModelInterface): Promise<object> {
		const film = (await Film.create(filmInfo)).get({ plain: true });
		const details = await FilmDetails.create({ ...detailsInfo, filmId: film.id }, { raw: true });
		await FilmRating.create({ ratingsCount: 0, starsCount: 0, filmId: film.id })
		return { ...film, details }
	}
}

export default FilmController;