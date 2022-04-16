import React from 'react'
import { Popup } from '../Popup/Popup'
import { IPopupTrailer } from './PopupTrailer.props'

export const PopupTrailer = ({ ytKey, visiblePopup, setVisiblePopup }: IPopupTrailer) => {
	return (
		<Popup visiblePopup={visiblePopup} setVisiblePopup={setVisiblePopup}>
			<iframe
				width="1120"
				height="630"
				src={`https://www.youtube-nocookie.com/embed/${ytKey}?autoplay=1`}
				title="YouTube video player"
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			></iframe>
		</Popup>
	)
}
