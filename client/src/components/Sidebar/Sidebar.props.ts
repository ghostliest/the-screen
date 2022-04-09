import React from 'react'
import { IQuery } from '../../API/types'

export interface ISidebar {
	setQuery: React.Dispatch<React.SetStateAction<IQuery>>
}
