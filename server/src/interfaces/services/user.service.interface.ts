import { IUserInterface } from '../models/user.model.interface'

export interface IUserService {
	createUser(email: string, username: string, password: string): Promise<IUserInterface>
	updateUser(id: number, updateInfo: { username: string, password: string }): Promise<void>
	deleteUser(userId: number): Promise<void>
	checkUser(email: string): Promise<IUserInterface | null>
}
