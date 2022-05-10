import { ILogger } from '../interfaces/logger/logger.interface'

export default class Logger implements ILogger {
	private logger = console

	private getDate () {
		const d = new Date()
		return `${d.toLocaleDateString()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}`
	}

	private wrapper (type: string, color: 'GREEN' | 'BLUE' | 'YELLOW' | 'RED' | 'GREY') {
		const styles: Record<string, number> = {
			GREEN: 32,
			BLUE: 34,
			YELLOW: 33,
			RED: 31,
			GREY: 90
		}

		const start = (col: string) => `\x1b[${styles[col]}m\x1B[1m`
		const end = () => '\x1B[22m\x1b[39m'

		return `${start('GREY')} ${this.getDate()} ${end()} ${start(color)} [ ${type} ] ${end()}`
	}

	public log (...args: unknown[]) {
		this.logger.log(this.wrapper('LOG', 'GREEN'), ...args)
	}

	public info (...args: unknown[]) {
		this.logger.info(this.wrapper('INFO', 'BLUE'), ...args)
	}

	public warn (...args: unknown[]) {
		this.logger.warn(this.wrapper('WARN', 'YELLOW'), ...args)
	}

	public error (...args: unknown[]) {
		this.logger.error(this.wrapper('ERROR', 'RED'), ...args)
	}
}
