import { folderType } from 'API/types'

export enum FolderActionTypesEnum {
	// eslint-disable-next-line no-unused-vars
	SET_FOLDER_NAME_POS = 'SET_FOLDER_NAME_POS'
}

export interface IFolderInitialState {
	prevFolderInfo: folderInfo
}

export interface folderInfo {
	folderName: folderType | '',
	scrollYPos: number,
	folderPage: number
}

export interface folderNamePosAction {
	type: FolderActionTypesEnum.SET_FOLDER_NAME_POS,
	payload: folderInfo
}
