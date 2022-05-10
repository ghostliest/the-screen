import sequelize from '../db'
import BaseService from './Base.service'
import { IFoldersService } from '../interfaces/services/folders.service.interface'

class FoldersService extends BaseService implements IFoldersService {
	private folders: { [key: string]: { table: string, tableFilms: string, tableFilmCol: string } } = {
		watchLater: { table: 'watchLaters', tableFilms: 'watchLater_films', tableFilmCol: 'watchLaterId' },
		favorite: { table: 'favorites', tableFilms: 'favorite_films', tableFilmCol: 'favoriteId' },
		viewed: { table: 'vieweds', tableFilms: 'viewed_films', tableFilmCol: 'viewedId' }
	}

	constructor () {
		super()
		this.createFolders = this.createFolders.bind(this)
		this.getFolderId = this.getFolderId.bind(this)
		this.getFolderContentIds = this.getFolderContentIds.bind(this)
		this.getFolderContentAdded = this.getFolderContentAdded.bind(this)
		this.deleteFolders = this.deleteFolders.bind(this)
		this.addToFolder = this.addToFolder.bind(this)
		this.checkInFolder = this.checkInFolder.bind(this)
	}

	private async getFolderId (userId: number, folderTable: string): Promise<number> {
		const folderId = await sequelize.query(
			`SELECT "id" FROM "${folderTable}" WHERE "userId" = ${userId}`,
			{ plain: true }
		) as { id: number }

		return folderId.id
	}

	public async getFolderContentIds (userId: number, folderTable: string) {
		const tableInfo = this.folders[folderTable]
		const folderId = await this.getFolderId(userId, tableInfo.table)

		const filmsIds = await sequelize.query(
			`SELECT ARRAY(SELECT "filmId" FROM "${tableInfo.tableFilms}"` +
			` WHERE "${tableInfo.tableFilmCol}" = ANY(ARRAY[${folderId}])` +
			' ORDER BY "createdAt" DESC)',
			{ plain: true }
		) as { array: number[] }

		return filmsIds?.array.length > 0 ? filmsIds.array : null
	}

	public async getFolderContentAdded (userId: number, folderTable: string, filmId: number) {
		const tableInfo = this.folders[folderTable]
		const folderId = await this.getFolderId(userId, tableInfo.table)

		const added = await sequelize.query(
			`SELECT "createdAt" FROM "${tableInfo.tableFilms}"` +
			` WHERE "${tableInfo.tableFilmCol}" = ${folderId} AND "filmId" = ${filmId}`,
			{ plain: true }
		) as { createdAt: string }

		return added.createdAt
	}

	public async createFolders (userId: number) {
		const foldersName = Object.keys(this.folders)
		for (const folderName of foldersName) {
			await sequelize.query(
				`INSERT INTO "${this.folders[folderName].table}"` +
				' ("id", "createdAt", "updatedAt", "userId")' +
				` VALUES(DEFAULT, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), ${userId})`
			)
		}

		this.logger.info(`Folders for userId: ${userId} created`)
	}

	public async deleteFolders (userId: number) {
		const foldersName = Object.keys(this.folders)

		for (const folder of foldersName) {
			const tableInfo = this.folders[folder]
			const folderId = await this.getFolderId(userId, tableInfo.table)
			this.logger.info('folderId: ', folderId)

			if (!folderId) {
				continue
			} else {
				await sequelize.query(
					`DELETE FROM "${tableInfo.tableFilms}" WHERE "${tableInfo.tableFilmCol}" = ${folderId}`
				)
				await sequelize.query(
					`DELETE FROM "${tableInfo.table}" WHERE "userId" = ${userId}`
				)
			}
		}
		this.logger.info(`Deleted folders userId: ${userId}`)
	}

	public async addToFolder (userId: number, filmId: number, folderName: string) {
		const folderId = await this.getFolderId(userId, `${folderName}s`)

		const filmInclude = await sequelize.query(
			`SELECT "filmId" FROM "${folderName + '_films'}"` +
			` WHERE "${folderName + 'Id'}" = ${folderId}` +
			` AND "${folderName + '_films'}"."filmId" = ${filmId}`,
			{ plain: true }
		) as { filmId: number }

		if (!filmInclude) {
			await sequelize.query(
				`INSERT INTO "${folderName + '_films'}" ("id", "createdAt", "updatedAt", "${folderName + 'Id'}", "filmId")` +
				` VALUES (DEFAULT, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3), ${folderId}, ${filmId})`
			)
			return true
		} else {
			await sequelize.query(
				`DELETE FROM "${folderName + '_films'}" WHERE "${folderName + 'Id'}" = ${folderId} AND "filmId" = ${filmId}`
			)
			return false
		}
	}

	public async checkInFolder (userId: number, filmId: number, folderName: string) {
		const folderId = await this.getFolderId(userId, `${folderName}s`)

		const isFilm = await sequelize.query(
			`SELECT "filmId" FROM "${folderName + '_films'}" WHERE "${folderName + 'Id'}" = ${folderId} AND "filmId" = ${filmId}`,
			{ plain: true }
		) as { filmId: number }

		return !!isFilm?.filmId
	}
}

export default FoldersService
