import App from './App'
import Logger from './logger/Logger'

(async () => {
	const app = new App(new Logger())
	await app.init()
})()
