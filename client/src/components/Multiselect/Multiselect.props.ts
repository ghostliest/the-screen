import React from 'react'
import { IMetaInfo } from '..'
import { TypeSearchMini } from '../../API/types'

export interface IMultiselect {
	placeholder: string,
	searchType: TypeSearchMini,
	menuValues: IMetaInfo,
	setMenuValues: React.Dispatch<React.SetStateAction<IMetaInfo>>
}
