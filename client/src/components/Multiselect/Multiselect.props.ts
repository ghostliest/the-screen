import React from 'react'
import { TypeSearchMini } from '../../API/types'
import { IMetaInfo } from '../ModalContentOperations/ModalContentOperations.props'

export interface IMultiselect {
	placeholder: string,
	searchType: TypeSearchMini,
	menuValues: IMetaInfo,
	setMenuValues: React.Dispatch<React.SetStateAction<IMetaInfo>>
}
