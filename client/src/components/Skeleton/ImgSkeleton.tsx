import React from 'react'
import ContentLoader from 'react-content-loader'

interface IImgSkeleton {
	width?: number | string,
	height?: number | string,
	speed?: number,
	backgroundColor?: string,
	foregroundColor?: string
}

export const ImgSkeleton = ({ width = '100%', height = '100%', speed = 2, backgroundColor = '#1e2122', foregroundColor = '#26292b' }: IImgSkeleton) => {
	return (
		<div className='img-skeleton'>
			<ContentLoader
				speed={speed}
				width={width}
				height={height}
				backgroundColor={backgroundColor}
				foregroundColor={foregroundColor}
			>
				<rect x="0" y="0" rx="3" ry="3" width={width} height={height} />
			</ContentLoader>
		</div>
	)
}
