import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FILM_ROUTE } from '../../utils/consts'
import { ReactComponent as PlayIcon } from '../../pages/Content/play.svg'
import { useActions } from '../../hooks'
import { ImgSkeleton } from '../Skeleton/ImgSkeleton'
import { IContentItemProps } from './ContentItem.props'
import { textCrop } from '../../utils'
import './ContentItem.css'

export const ContentItem = ({ content: { id, img, title, year, completionYear, isFilm, details, rating }, visibleRate = true }: IContentItemProps) => {
	const [imgDownloaded, setImgDownloaded] = useState(false)

	if (id <= 0) {
		return <></>
	}

	return (
		<div className='item_wrapper'>
			{
				!imgDownloaded &&
				<div className="content-item_poster-wrapper">
					<div className='content-item-skeleton'>
						<ImgSkeleton />
					</div>
				</div>
			}
			{ details?.youtubeTrailerKey && imgDownloaded && <WatchTrailerBtn ytKey={details.youtubeTrailerKey} /> }
			<Link to={`${FILM_ROUTE}/${id}`} className='item' style={{ opacity: imgDownloaded ? '1' : '0' }}>
				<div className="poster-wrapper">
					<div className="poster-link">
						<img src={process.env.REACT_APP_API_IMAGES_URL + img}
							alt="poster"
							className="poster"
							onLoad={() => setImgDownloaded(true)}
						/>
					</div>
					{
						visibleRate && rating?.ratingsCount >= 0 &&
							<div className="rate" style={{ background: rating.starsCount > 0 ? '#3bb33b' : '#484e51' }}>
								{
									rating.starsCount >= 1 && rating.starsCount !== 0
										? (rating.starsCount / rating.ratingsCount).toFixed(1)
										: 'insufficient data'
								}
							</div>
					}
				</div>
				<div className="captions">
					<span className="title">{textCrop(title, 30)}</span>
					<div className='subtitle'>
						<span className="subtitle">{year}</span>
						{
							!isFilm &&
								<span>{completionYear ? -completionYear : '...'}</span>
						}
					</div>
				</div>
			</Link>
		</div>
	)
}

const WatchTrailerBtn = ({ ytKey }: { ytKey: string }) => {
	const { setTrailer } = useActions()
	const trailerBtnRef = useRef<any>()

	const handleItemClick = () => {
		setTrailer({ isShowTrailer: true, trailerKey: ytKey })
	}

	return (
		<div className="nameplate_container" onClick={() => handleItemClick()} ref={trailerBtnRef}>
			<div className="wrapper">
				<div className="nameplate_wrapper">
					<div className="labelVisible">
						<span className="labelVisible_text">WATCH TRAILER</span>
					</div>
					<div className="label_icon-container">
						<div className="label_icon">
							<PlayIcon />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
