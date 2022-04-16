import { FolderActionTypesEnum, folderInfo, folderNamePosAction } from '../types/folderTypes'

export const setFolderPosAndName = (value: folderInfo): folderNamePosAction => {
	return {
		type: FolderActionTypesEnum.SET_FOLDER_NAME_POS,
		payload: value
	}
}
