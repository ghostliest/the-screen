import { combineReducers } from 'redux'
import userReducer from './userReducer'
import contentReducer from './contentReducer'
import folderReducer from './folderReduces'
import componentsInfoReducer from './componentsInfoReducer'
import { store } from '../store'

export const rootReducer = combineReducers({
	user: userReducer,
	content: contentReducer,
	folder: folderReducer,
	componentsInfo: componentsInfoReducer
})

export type RootState = ReturnType<typeof store.getState>
