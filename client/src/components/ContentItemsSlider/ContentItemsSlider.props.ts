import { IMiniContent } from 'store/types/contentTypes'

export interface IContentItemsSlider {
	content: IMiniContent[],
	title: string,
	visibleCount: number
}
