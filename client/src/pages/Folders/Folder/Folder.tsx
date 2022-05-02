import React, { Fragment, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getFolderContent } from '../../../API/userApi'
import { folderType } from '../../../API/types'
import { IFolderContent, IFolderContentFull } from '../../../../../types/folder.types'
import { ButtonIconText, HistorySlider, Rating, Spinner } from '../../../components'
import { ReactComponent as WatchLaterIcon } from '../watchLater.svg'
import { ReactComponent as HeartIcon } from '../heart.svg'
import { ReactComponent as ViewedIcon } from '../viewed.svg'
import ContentLoader from 'react-content-loader'
import { useActions, useCheckScrollEnd, useScrollY, useTypeSelector } from '../../../hooks'
import { FILM_ROUTE, FOLDERS_ROUTE } from '../../../utils/consts'
import { timeFormat } from '../../../utils'
import './Folder.css'

const folderContentInitial: IFolderContentFull = {
	count: 0,
	rows: [{
		id: 0,
		title: '',
		year: 0,
		img: '',
		isFilm: true,
		completionYear: null,
		added: '',
		rating: {
			ratingsCount: 0,
			starsCount: 0,
			userRating: 0
		},
		details: {
			duration: 0
		},
		directors: [{ id: 0, value: '' }],
		actors: [{ id: 0, value: '' }],
		countries: [{ id: 0, value: '' }],
		genres: [{ id: 0, value: '' }]
	}]
}

export const Folder = () => {
	const [menuItems] = useState<{ value: string, type: folderType, icon: React.ReactElement}[]>([
		{ value: 'Watch later', type: 'watchLater', icon: <WatchLaterIcon /> },
		{ value: 'Favorite', type: 'favorite', icon: <HeartIcon /> },
		{ value: 'Viewed', type: 'viewed', icon: <ViewedIcon /> }
	])

	const [contents, setContents] = useState<IFolderContentFull>(folderContentInitial)
	const [currentFolderType, setCurrentFolderType] = useState<folderType | ''>('')
	const [currentFolderPage, setCurrentFolderPage] = useState(1)
	const [LIMIT] = useState(5)
	const [isBack, setIsBack] = useState(false)
	const [isLoading, setLoading] = useState(true)
	const [errorMessage, setErrorMessage] = useState('')

	const navigate = useNavigate()
	const { pathname } = useLocation()
	const params = useParams() as { type: folderType }

	const { scrollYPos, folderName: stateFolderName, folderPage: stateFolderPage } = useTypeSelector(state => state.folder.prevFolderInfo)
	const { setFolderPosAndName } = useActions()

	const isScrollEnd = useCheckScrollEnd(100)
	const yPos = useScrollY()

	useEffect(() => {
		if (currentFolderType !== params.type) {
			setCurrentFolderType(params.type)
		}
	}, [pathname])

	useEffect(() => {
		const menuItemSearchType = menuItems.find(i => i.type === params.type)?.type

		if (menuItemSearchType === stateFolderName) {
			setIsBack(true)
		} else {
			handleFolderNavigate(menuItemSearchType!)
		}
	}, [])

	useEffect(() => {
		if (isScrollEnd && contents.rows.length < contents.count) {
			setCurrentFolderPage(p => ++p)
		}
	}, [isScrollEnd])

	useEffect(() => {
		if (isBack && currentFolderType) {
			const count = stateFolderPage * LIMIT
			setCurrentFolderPage(stateFolderPage)
			getFolderContent(currentFolderType, currentFolderPage, LIMIT, count)
				.then(res => setContents(res))
				.finally(() => setLoading(false))
		}
	}, [isBack])

	useEffect(() => {
		if (!currentFolderType || isBack) return
		setErrorMessage('')
		setLoading(true)
		getFolderContent(currentFolderType || 'watchLater', 1, LIMIT)
			.then(res => {
				if (res.message) setErrorMessage(res.message)
				else setContents(res)
			})
			.finally(() => setLoading(false))
	}, [currentFolderType])

	useEffect(() => {
		if (!currentFolderType || currentFolderPage <= 1 || isBack) return
		getFolderContent(currentFolderType!, currentFolderPage, LIMIT)
			.then(res => setContents(({ rows }) => (
				{ count: res.count, rows: rows.concat(res.rows) }
			)))
			.finally(() => setLoading(false))
	}, [currentFolderPage])

	useEffect(() => {
		if (isBack) {
			setTimeout(() => {
				window.scrollTo({ top: scrollYPos, behavior: 'smooth' })
				setIsBack(false)
			}, 0)
		}
	}, [contents])

	const handleFolderNavigate = (folderType: folderType) => {
		setCurrentFolderPage(1)
		setContents(folderContentInitial)
		setCurrentFolderType(folderType)
		navigate(`${FOLDERS_ROUTE}/${folderType}`)
	}

	const getActiveItemIndex = () => {
		return menuItems.findIndex(i => i.type === currentFolderType)
	}

	const handleSidebarItemClick = (folderType: folderType, idx: number) => {
		if (folderType === currentFolderType) return
		if (idx === getActiveItemIndex()) return
		handleFolderNavigate(folderType)
	}

	const handleContentItemClick = (id: number) => {
		setFolderPosAndName({
			folderName: currentFolderType,
			scrollYPos: yPos,
			folderPage: currentFolderPage
		})
		navigate(`${FILM_ROUTE}/${id}`)
	}

	return (
		<div className='folders-container'>
			<div className="widget folders-sidebar-container">
				<div className="folders-sidebar-wrapper">
					<div className="folders-sidebar-btns-container">
						{
							menuItems.map(({ value, type, icon }, idx) => (
								<ButtonIconText
									key={value}
									onClick={() => handleSidebarItemClick(type, idx)}
									text={value}>
									{icon}
								</ButtonIconText>
							))
						}
					</div>
					<HistorySlider visibleCount={1} />
				</div>
			</div>
			<div className="widget folders-content" style={{ height: isLoading ? '70vh' : 'fit-content' }}>
				{
					isLoading
						? <Spinner />
						: <>
							<div className="folders-content-header">
								<h1>
									<span>{currentFolderType && menuItems[getActiveItemIndex()].value}</span>
									<span>{contents.count > 0 && ` (${contents.count})`}</span>
								</h1>
							</div>
							{
								errorMessage
									? <div className='folder-empty'>
										<h2>{errorMessage}</h2>
									</div>
									: <ul className='folders-content-col'>
										{
											contents.rows.map(item => (
												<li
													key={item.id}
													className="folders-content-row"
													onClick={() => handleContentItemClick(item.id)}
												>
													<ContentItem item={item} />
												</li>
											))
										}
									</ul>
							}
						</>
				}
			</div>
		</div>
	)
}

interface IContentItem {
	item: IFolderContent
}

const ContentItem = ({ item }: IContentItem) => {
	const { id, img, isFilm, title, completionYear, year, countries, directors, actors, genres, rating, details, added } = item
	const [imgUploaded, setImgUploaded] = useState(false)

	const dateFormat = (value: string) => {
		const format = (digit: number) => {
			return digit < 10 ? '0' + digit : digit
		}
		const date = new Date(value)
		return `${format(date.getUTCDay())}.${format(date.getUTCMonth() + 1)}.${date.getFullYear()}, ${format(date.getHours())}:${format(date.getMinutes())}`
	}

	return (
		<>
			<div className = "content-col-img" >
				<div className="folder-poster-container">
					{ !imgUploaded && <ImgLoader /> }
					<img
						src={process.env.REACT_APP_API_IMAGES_URL + img}
						className="folder-poster"
						alt="poster"
						style={{ opacity: imgUploaded ? '1' : '0' }}
						onLoad={() => setImgUploaded(true)}
					/>
				</div>
			</div>
			<div className="content-col-details">
				<div className="folder-content-title-container">
					<div className="folder-content-title">{isFilm ? title : `${title} (TV series)`}</div>
					<div className="folder-content-subtitle">
						<div className="content-subtitle-year">{completionYear ? `(${year} - ${completionYear})` : `(${year})`}</div>
						<div className="content-subtitle-time">{timeFormat(details.duration, isFilm)}</div>
					</div>
				</div>
				<div className="folder-content-meta-container">
					{
						[countries, directors, actors, genres].map((i, idx) => (
							<div key={idx} className="folder-content-row folder-content-meta-row">
								<span className='folder-content-meta-header'>
									{ ['Country', 'Director', 'Actor', 'Genre'][idx] }:&nbsp;
								</span>
								<div className="folder-content-row folder-content-meta-items">
									{
										i.map(({ id, value }, idx, arr) => (
											<Fragment key={id}>
												<div className="link">{value}</div>
												{idx < arr.length - 1 ? <span>,&nbsp;</span> : ''}
											</Fragment>
										))
									}
								</div>
							</div>
						))
					}
				</div>
			</div>
			<div className="content-col-rate">
				<Rating
					filmId={id}
					starsCount={rating.starsCount}
					ratingsCount={rating.ratingsCount}
					userRating={rating.userRating || -1}
					isAuth={true}
				/>
				<span className='added-date'>{`Added: ${dateFormat(added)}`}</span>
			</div>
		</>
	)
}

const ImgLoader = () => (
	<ContentLoader
		speed={2}
		width={140}
		height={210}
		viewBox="0 0 140 210"
		backgroundColor="#1e2122"
		foregroundColor="#26292b"
	>
		<rect x="0" y="0" rx="4" ry="4" width="140" height="210" />
	</ContentLoader>
)
