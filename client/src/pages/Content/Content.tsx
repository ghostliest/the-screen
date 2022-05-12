import React, { Fragment, useEffect, useState, useRef } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getFullContent } from 'API/contentApi'
import { addToFolder, CheckInFolder, checkRate } from 'API/userApi'
import { useTypeSelector } from 'hooks'
import { Rating, ButtonIconText, PopupTrailer, HistorySlider, ImgSkeleton } from 'components'
import { LOGIN_ROUTE, PERSON_ROUTE } from 'utils/consts'
import { LocalStorageHistory, timeFormat } from 'utils'
import { ReactComponent as PlayIcon } from 'assets/play.svg'
import { ReactComponent as DoneIcon } from 'assets/done.svg'
import { IFullContent } from 'store/types/contentTypes'
import { fullContentInitial } from 'store/reducers/contentReducer'
import './Content.css'

export const Content = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const { pathname } = useLocation()

	const { isAuth } = useTypeSelector(state => state.user)
	const [imgdownloaded, setImgdownloaded] = useState(false)

	const [inWatchLater, setInWatchLater] = useState(false)
	const [inFavorite, setInFavorite] = useState(false)
	const [isShowTrailer, setIsShowTrailer] = useState(false)

	const [content, setContent] = useState<IFullContent>(fullContentInitial)
	const [userRate, setUserRate] = useState(0)

	const contentIdRef = useRef() as any

	const detailInfo = [
		{ key: 'year', value: content.details.seasonCount ? `${content.year} (${content.details.seasonCount} seasons)` : `${content.year}`, redirect: '' },
		{ key: 'country', value: content.countries, redirect: '' },
		{ key: 'genres', value: content.genres, redirect: '' },
		{ key: 'directors', value: content.directors, redirect: '' },
		{ key: 'duration', value: timeFormat(content.details.duration, content.isFilm), redirect: '' },
		{ key: 'ageRating', value: content.details.ageRating + '+', redirect: '' }
	]

	const handleAddToFolder = (folderName: 'watchLater' | 'favorite') => {
		if (isAuth) {
			addToFolder(folderName, +id!)
				.then(res => {
					if (res.operation === 'add' && folderName === 'watchLater') {
						setInWatchLater(true)
					} else if (res.operation === 'add' && folderName === 'favorite') {
						setInFavorite(true)
					} else if (res.operation === 'remove' && folderName === 'watchLater') {
						setInWatchLater(false)
					} else if (res.operation === 'remove' && folderName === 'favorite') {
						setInFavorite(false)
					}
				})
		} else {
			navigate(`${LOGIN_ROUTE}?next=${pathname}`)
		}
	}

	const handleId = () => {
		getFullContent(id!)
			.then(res => {
				console.log('GET ONE RES: ', res)
				setContent(res)
			})
		checkRate(+id!)
			.then(res => {
				console.log('Rating checkRate: ', res)
				if (res.rate) setUserRate(res.rate)
			})
	}

	useEffect(() => {
		window.scrollTo(0, 0)
		handleId()
		return () => {
			LocalStorageHistory.save(+id!)
			setImgdownloaded(false)
		}
	}, [])

	useEffect(() => {
		if (isAuth) {
			CheckInFolder('watchLater', +id!)
				.then(res => {
					console.log('Action CHECK WL:', res)
					setInWatchLater(res.status)
				})
			CheckInFolder('favorite', +id!)
				.then(res => {
					console.log('Action CHECK FAV:', res)
					setInFavorite(res.status)
				})
		}
	}, [isAuth, id])

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
		if (contentIdRef?.current) LocalStorageHistory.save(contentIdRef.current)
		handleId()
	}, [id])

	useEffect(() => {
		if (content?.id > 0) contentIdRef.current = content?.id
	}, [content?.id])

	const Trailer = () => {
		return (
			<div className="trailer-container" onClick={() => setIsShowTrailer(true)}>
				<div className="trailer-img-container">
					<div className="trailer-poster-wrapper">
						<img
							className='trailer-poster'
							src={process.env.REACT_APP_API_URL_YT_IMG_BASE + content.details.youtubeTrailerKey + process.env.REACT_APP_API_URL_YT_IMG_SIZE}
							alt={content.title + ' trailer'}
						/>
						<div className="trailer_play-icon">
							<PlayIcon />
						</div>
					</div>
				</div>
			</div>
		)
	}

	const AddToFolderBtns = () => {
		return (
			<div className="btns_folder-container">
				<ButtonIconText
					onClick={() => handleAddToFolder('watchLater')}
					text='Watch later'>
					{inWatchLater ? <DoneIcon /> : '+'}
				</ButtonIconText>
				<ButtonIconText
					onClick={() => handleAddToFolder('favorite')}
					text='Favotite'>
					{inFavorite ? <DoneIcon /> : '+'}
				</ButtonIconText>
			</div>
		)
	}

	const FirstRow = () => {
		return (
			<div className="first">
				<div className="content-title-container">
					<h1 className='content-title'>
						<span>{content.title}</span>
						{!content.isFilm && <span>{' (TV series ' + content.year + '-' + (content.completionYear ? content.completionYear + ')' : '...)')}</span>}
					</h1>
				</div>
				<Rating
					filmId={+id!}
					starsCount={content?.rating?.starsCount}
					ratingsCount={content?.rating?.ratingsCount}
					userRating={userRate}
					isAuth={isAuth}
				/>
			</div>
		)
	}

	const SecondRow = () => {
		return (
			<div className="second">
				<div className="about-content-container">
					<h2>About content</h2>
					<div className="info-table">
						{
							detailInfo.map(({ key, value, redirect }: { key: string, value: number | string | any[] | null, redirect: string}, idx) => (
								(typeof value === 'object' && value?.length === 0) || !value
									? <Fragment key={idx}></Fragment>
									:	<div key={idx} className="info-row">
										<div className="info-row-title">{key}</div>
										<div className="info-row-value">
											{
												Array.isArray(value)
													? <>
														{
															value.map((item: any, id) => (
																<Fragment key={item.id}>
																	<div key={item.id} className="info-row-detail link">{item.value}</div>
																	{id < value.length - 1 ? <span>,&nbsp;</span> : ''}
																</Fragment>
															))
														}
													</>
													: <div className="info-row-detail link">{value}</div>
											}
										</div>
									</div>
							))
						}
					</div>
				</div>
				<div className="actors-container">
					<h3>Cast</h3>
					<ul className="actors">
						{
							content.actors.map(({ id, value }) => {
								return (
									<li key={id} className="actor">
										<Link to={`${PERSON_ROUTE}/${id}`} className='link'>{value}</Link>
									</li>
								)
							})
						}
					</ul>
				</div>
			</div>
		)
	}

	return (
		<>
			{
				isShowTrailer	&&
				<PopupTrailer
					ytKey={content.details.youtubeTrailerKey}
					visiblePopup={isShowTrailer}
					setVisiblePopup={setIsShowTrailer}
				/>
			}
			<div className="widget content-wrapper">
				<div className="media-container">
					<div className="content-poster-container">
						{ !imgdownloaded && <ImgSkeleton /> }
						<img
							className="content-poster"
							src={process.env.REACT_APP_API_IMAGES_URL + content.img}
							alt={content.title}
							onLoad={() => setImgdownloaded(true)}
							style={{ opacity: imgdownloaded ? '1' : '0' }}
						/>
					</div>
					<AddToFolderBtns />
					<Trailer/>
				</div>
				<div className="content-info" style={{ opacity: content.details.description ? '1' : '0' }}>
					<FirstRow />
					<SecondRow />
					<div className="third">
						<p className="description">{content.details.description}</p>
					</div>
				</div>
			</div>
			<HistorySlider removeCurrentId={+id!} visibleCount={3} />
		</>
	)
}
