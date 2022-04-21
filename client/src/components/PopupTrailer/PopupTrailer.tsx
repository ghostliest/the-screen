import React, { useRef } from 'react'
import { Popup } from '../Popup/Popup'
import { useOnClickOutside } from '../../hooks'
import { IPopupTrailer } from './PopupTrailer.props'
import './PopupTrailer.css'

export const PopupTrailer = ({ ytKey, visiblePopup, setVisiblePopup }: IPopupTrailer) => {
	const trailerRef = useRef() as any
	useOnClickOutside(trailerRef, () => setVisiblePopup(false))

	return (
		<Popup visiblePopup={visiblePopup} setVisiblePopup={setVisiblePopup}>
			<div className="popup-trailer" ref={trailerRef}>
				<iframe
					width="1120"
					height="630"
					src={`https://www.youtube-nocookie.com/embed/${ytKey}?autoplay=1`}
					title="YouTube video player"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				></iframe>
			</div>
		</Popup>
	)
}
