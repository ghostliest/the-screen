export default class HttpStatus extends Error {
	status: number
	message: string

	constructor (status: number, message: string) {
		super()
		this.status = status
		this.message = message
	}

	static badRequest (message: string) {
		return new HttpStatus(404, message)
	}

	static forbidden (message: string) {
		return new HttpStatus(403, message)
	}

	static unauthorized (message: string) {
		return new HttpStatus(401, message)
	}

	static internal (message: string) {
		return new HttpStatus(500, message)
	}

	static NoContent (message: string) {
		return new HttpStatus(204, message)
	}
}
