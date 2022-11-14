import React, { useRef } from 'react'
import { useOnClickEsc, useOnClickOutside } from 'hooks'
import { IPopup } from './Popup.props'
import './Popup.css'

export const Popup = ({ children, visiblePopup, setVisiblePopup }: IPopup) => {
	const popupRef = useRef() as any

	useOnClickOutside(popupRef, () => setVisiblePopup(false))
	useOnClickEsc(visiblePopup, () => setVisiblePopup(false))

	return (
		<div className='popup_container'>
			<div className="popup_content" ref={popupRef}>
				{children}
			</div>
		</div>
	)
}
