import { FolderActionTypesEnum, IFolderInitialState } from '../types/folderTypes'

const initialState: IFolderInitialState = {
	prevFolderInfo: {
		folderName: '',
		scrollYPos: 0,
		folderPage: 0
	}
}

const folderReducer = (state = initialState, { type, payload }: any): IFolderInitialState => {
	switch (type) {
	case FolderActionTypesEnum.SET_FOLDER_NAME_POS:
		return { ...state, prevFolderInfo: { ...payload } }
	default:
		return { ...state }
	}
}

export default folderReducer
