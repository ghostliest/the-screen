import { BuildOptions, Model } from 'sequelize'
import { BaseModelInterface } from './base.model.interface'

export interface IUserInterface {
	id: number,
	email: string,
	username: string,
	role: 'USER' | 'ADMIN'
	password: string
}

export interface UserModelInterface extends Model, IUserInterface, BaseModelInterface { }

export type UserModelInterfaceStatic = typeof Model & {
	new(values?: object, options?: BuildOptions): UserModelInterface;
}
