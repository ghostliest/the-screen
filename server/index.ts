require('dotenv').config()
import sequalize from './db';
import express from 'express';
const app = express();

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
	res.status(200).send('Server is Working!')
})

const start = async () => {
	try {
		await sequalize.authenticate();
		await sequalize.sync();
		app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
	} catch (e) {
		console.log(e);
	}
}

start();
