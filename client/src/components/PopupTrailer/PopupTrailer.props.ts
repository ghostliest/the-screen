import React from 'react'

export interface IPopupTrailer {
	ytKey: string,
	visiblePopup: boolean,
	setVisiblePopup: React.Dispatch<React.SetStateAction<boolean>> | any
}
