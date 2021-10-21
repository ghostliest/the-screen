require('dotenv').config();
import express from 'express';
import path from 'path';
import sequelize from './db';
import models = require('./models/models');
const cors = require('cors');
import fileupload from 'express-fileupload';
import router from './routes/index';
import errorHandler from './middleware/ErrorHandlingMiddleware';

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.resolve(__dirname, 'static')));
app.use(fileupload({}));
app.use('/api', router);
app.use(errorHandler);

const start = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();
		app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
	} catch (e) {
		console.log(e);
	}
};

start();
