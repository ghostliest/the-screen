import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { randomInRange } from '../../utils/randomInRange'

export const InDevelopment = () => {
	const styles: any = {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		gap: '20px'
	}
	const navigate = useNavigate()

	const [gif] = useState(['2of', '2jzm', '74Vj', '2rM', '4QVQ'])

	return (
		<div style={styles}>
			<h1>THIS PAGE IS UNDER DEVELOPMENT</h1>
			<div className="iframe-container">
				<iframe
					style={{ borderRadius: '10px', pointerEvents: 'none', userSelect: 'none' }}
					src={`https://gifer.com/embed/${gif[randomInRange(0, gif.length - 1)]}`}
					width={480}
					height={270.169}
					frameBorder="0"
					allowFullScreen>
				</iframe>
			</div>
			<h2 onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
				GO BACK
			</h2>
		</div>
	)
}
