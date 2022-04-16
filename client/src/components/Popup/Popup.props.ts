
import React from 'react'

export interface IPopup {
	children: React.ReactElement,
	visiblePopup: boolean,
	setVisiblePopup: React.Dispatch<React.SetStateAction<boolean>>
}
