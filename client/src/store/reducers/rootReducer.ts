import { combineReducers } from 'redux'
import userReducer from './userReducer'
import contentReducer from './contentReducer'
import { store } from '../store'

export const rootReducer = combineReducers({
	user: userReducer,
	content: contentReducer
})

export type RootState = ReturnType<typeof store.getState>
