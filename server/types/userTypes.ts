import { BuildOptions, Model } from 'sequelize';
import { BaseModelInterface } from './baseTypes';

export interface UserModelInterface extends Model, BaseModelInterface {
	email: string,
	username: string,
	password: string,
	role: "USER" | "ADMIN",
}

export type UserModelInterfaceStatic = typeof Model & {
	new(values?: object, options?: BuildOptions): UserModelInterface;
}
