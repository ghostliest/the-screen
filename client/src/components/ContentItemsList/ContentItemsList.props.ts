import React from 'react'
import { IQuery } from '../../API/types'

export interface IContentItemsList {
	page: number,
	limit: number,
	setQuery: React.Dispatch<React.SetStateAction<IQuery>>
}
