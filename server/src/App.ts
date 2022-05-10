import 'dotenv/config'
import cors from 'cors'
import express, { Express } from 'express'
import fileupload from 'express-fileupload'
import path from 'path'
import sequelize from './db'
import router from './routes/index'
import errorHandler from './middleware/errorHandling.middleware'
import { ILogger } from './interfaces/logger/logger.interface'

export default class App {
	private app: Express
	private port: number

	constructor (private readonly logger: ILogger) {
		this.app = express()
		this.port = +process.env.PORT!
	}

	private useMiddleware () {
		this.app.use(cors())
		this.app.use(express.json())
		this.app.use('/images', express.static(path.resolve(__dirname, '..', 'static')))
		this.app.use(fileupload({}))
		this.app.use('/api', router)
		this.app.use(errorHandler)
	}

	public async init () {
		try {
			this.useMiddleware()
			await sequelize.authenticate()
			await sequelize.sync()
			this.app.listen(this.port, () => {
				this.logger.info(`Server started on port: ${this.port}, pid: ${process.pid}`)
			})
		} catch (e) {
			this.logger.error(e)
		}
	}
}
