import { Sequelize } from 'sequelize'

export default new Sequelize(
	process.env.DB_NAME as string,
	process.env.DB_USER as string,
	process.env.DB_PASSWORD,
	{
		dialect: 'postgres',
		host: process.env.DB_HOST,
		port: parseInt(process.env.DB_PORT as string)
	}
)
