import sequelize from '../db'
import { User } from '../models/models'
import BaseService from './Base.service'
import { IUserInterface } from '../interfaces/models/user.model.interface'
import { IUserService } from '../interfaces/services/user.service.interface'

class UserService extends BaseService implements IUserService {
	constructor () {
		super()
		this.createUser = this.createUser.bind(this)
		this.updateUser = this.updateUser.bind(this)
		this.deleteUser = this.deleteUser.bind(this)
		this.checkUser = this.checkUser.bind(this)
	}

	public async createUser (email: string, username: string, password: string): Promise<IUserInterface> {
		return await User.create({
			email, username, password
		})
	}

	public async updateUser (id: number, updateInfo: { username: string; password: string }): Promise<void> {
		await User.update(updateInfo, { where: { id } })
	}

	public async deleteUser (userId: number): Promise<void> {
		await sequelize.query(`DELETE FROM "users" WHERE "id" = ${userId}`)
	}

	public async checkUser (email: string): Promise<IUserInterface | null> {
		return await User.findOne({
			where: { email },
			attributes: ['id', 'email', 'username', 'password', 'role'],
			raw: true
		}) as IUserInterface
	}
}

export default UserService
