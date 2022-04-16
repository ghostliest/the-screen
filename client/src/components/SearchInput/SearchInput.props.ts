import { TypeSearchFull } from '../../API/types'
import { ISearchRes } from '../../store/types/contentTypes'

export interface ISearchInput {
	searchType: TypeSearchFull,
	autoFocus?: boolean,
	placeholder: string,
	redirect: boolean,
	handleSuggestItemClick?: (type: any, id: any) => void
}

export interface ISearchResultMenu {
	redirect?: boolean,
	handleClickMenuItem: () => void
	handleSuggestItemClick?: (type: any, id: any) => void,
	result: ISearchRes | any,
	resultError: string,
	cursorPos: number
}
