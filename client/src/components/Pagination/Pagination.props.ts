import React from 'react'
import { IQuery } from '../../API/types'

export interface IPagination {
	page: number,
	count: number,
	limit: number,
	setQuery: React.Dispatch<React.SetStateAction<IQuery>>
}
