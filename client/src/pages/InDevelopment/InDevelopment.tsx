import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { randomInRange } from '../../utils/randomInRange'
import { IInDevelopment } from './InDevelopment.props'

export const InDevelopment = ({ header = 'THIS PAGE IS UNDER DEVELOPMENT', gifferIds = ['2of', '2jzm', '74Vj', '2rM', '4QVQ'] }: IInDevelopment) => {
	const styles: any = {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		gap: '20px',
		textAlign: 'center'
	}

	const navigate = useNavigate()
	const [gif] = useState(gifferIds)

	return (
		<div style={styles}>
			<h1>{header}</h1>
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
			<h2 onClick={() => navigate(-1)} className='link'>
				GO BACK
			</h2>
			<h3>
				<Link to="/" className='link'>HOME</Link>
			</h3>
		</div>
	)
}
