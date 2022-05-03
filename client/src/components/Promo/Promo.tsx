import React, { Fragment, useEffect, useRef, useState } from 'react'
import ContentLoader from 'react-content-loader'
import { Link } from 'react-router-dom'
import { getFullContent } from '../../API/contentApi'
import { FILM_ROUTE, PERSON_ROUTE } from '../../utils/consts'
import { textCrop } from '../../utils'
import './Promo.css'

export const Promo = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [content, setContent] = useState({
		id: 0,
		title: '',
		actors: [{ id: 0, value: '' }],
		directors: [{ id: 0, value: '' }],
		details: { youtubeTrailerKey: '', description: '' }
	})
	const [descriptionLength, setDescriptionLength] = useState(300)
	const [showDescription, setShowDescription] = useState(true)

	const promoRef = useRef() as any
	const detailsRef = useRef() as any
	const iframeRef = useRef() as any

	const handleResize = () => {
		const width = promoRef?.current?.getBoundingClientRect()?.width
		if (width < 890) {
			setShowDescription(false)
		} else if (width < 1100) {
			setShowDescription(true)
			setDescriptionLength(145)
		} else {
			setShowDescription(true)
			setDescriptionLength(300)
		}
	}

	useEffect(() => {
		handleResize()
		getFullContent('14')
			.then((res: any) => {
				setContent(res)
				console.log('PROMO CONTENT: ', res)
				setIsLoading(true)
			}) as any
	}, [])

	useEffect(() => {
		const onScroll = () => {
			const scrollPos = window.scrollY
			const elHeight = promoRef?.current?.clientHeight
			if (scrollPos < elHeight) {
				promoRef.current.style.opacity = `${1 - (scrollPos * 0.002)}`
				promoRef.current.style.filter = `brightness(${1 - (scrollPos * 0.002)})`
				promoRef.current.style.transform = `scale(${1 - (scrollPos * 0.0002)})`
			}
		}

		window.addEventListener('scroll', onScroll)
		return () => window.removeEventListener('scroll', onScroll)
	}, [onscroll])

	useEffect(() => {
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [onresize])

	const Persons = ({ title, content }: { title: string, content: { id: number, value: string }[] }) => {
		return (
			content.length
				? <div className="promo-info-container">
					<div className="promo-title">{`${title}:`}</div>
					<div className="promo-row">
						{
							content.map(({ id, value }, idx, arr) => (
								<Fragment key={id}>
									<Link to={`${PERSON_ROUTE}/${id}`} className="info-row-detail link">{value}</Link>
									{idx < arr.length - 1 ? <span>,&nbsp;</span> : ''}
								</Fragment>
							))
						}
					</div>
				</div>
				: <></>
		)
	}

	return (
		<div className="widget main-promo" ref={promoRef}>
			<div className="promo-content-container" ref={detailsRef}>
				<div className="promo-content-title">{content.title}</div>
				{
					showDescription &&
						<div className="promo-description">
							<p>{textCrop(content.details.description, descriptionLength)}</p>
						</div>
				}
				{
					isLoading &&
					<>
						<Persons title='Cast' content={content.actors} />
						<Persons title='Director' content={content.directors} />
					</>
				}
			</div>
			<Link to={`${FILM_ROUTE}/${content.id}`} className='main-promo-link'>
				{
					!isLoading
						? <div className='promo-loader-wrapper'>
							<PromoLoader className={'widget loader'} />
						</div>
						:	<>
							<div className="promo-gradient"></div>
							<div className="yt-promo-iframe-container">
								<iframe
									ref={iframeRef}
									width="1280"
									height="720"
									src={`https://www.youtube-nocookie.com/embed/${content.details.youtubeTrailerKey}?start=24&end=140&autoplay=1&mute=1&loop=1&color=white&showinfo=0&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&playlist=${content.details.youtubeTrailerKey}`}
									title="YouTube video player"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen>
								</iframe>
							</div>
						</>
				}
			</Link>
		</div>
	)
}

const PromoLoader = ({ className }: any) => (
	<ContentLoader
		speed={2}
		backgroundColor="#181a1b"
		foregroundColor="#000000"
		className={className}
	>
		<rect x="0" y="0" width="100%" height="100%" />
	</ContentLoader>
)
