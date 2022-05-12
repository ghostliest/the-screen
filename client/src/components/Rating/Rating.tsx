import React, { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useOnClickOutside } from 'hooks'
import { ReactComponent as StarIcon } from 'assets/star.svg'
import { LOGIN_ROUTE } from 'utils/consts'
import { addUserRate } from 'API/userApi'
import { IRating } from './Rating.props'
import './Rating.css'

export const Rating = ({ filmId, starsCount, ratingsCount, userRating = 0, isAuth }: IRating) => {
	const navigate = useNavigate()
	const { pathname } = useLocation()

	const [showPicker, setShowPicker] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)
	const [starsCountInside, setStarsCountInside] = useState(starsCount)
	const [ratingsCountInside, setRatingsCountInside] = useState(ratingsCount)
	const [userRatingInside, setUserRatingInside] = useState(userRating)

	const closeAll = () => {
		setShowConfirm(false)
		setShowPicker(false)
	}

	const ref = useRef(null) as any
	useOnClickOutside(ref, () => closeAll())

	const calcColor = (n: number): any => {
		if (n >= 7) return '#5bc95b'
		if (n >= 5) return '#9d9488'
		if (n >= 1) return '#ff1a1a'
		if (n === 0) return '#f5f5f533'
	}

	const setColor = (e: any, i: any) => {
		e.target.style.color = calcColor(i)
	}

	const choiceRating = (rating: number) => {
		if (isAuth) {
			addUserRate({ filmId, rating })
				.then(res => {
					if (res.message === 'OK') {
						if (!userRatingInside) {
							setStarsCountInside(p => p + rating)
							setRatingsCountInside(p => p + 1)
						} else {
							setStarsCountInside(p => p + (rating - userRatingInside))
						}
						setUserRatingInside(rating)
					}
				})
			setShowPicker(false)
		} else {
			navigate(`${LOGIN_ROUTE}?next=${pathname}`)
		}
	}

	const handleChoiseRate = () => {
		if (userRatingInside) {
			setShowConfirm(true)
		} else {
			setShowPicker(true)
		}
	}

	const StarBtns = () => {
		const btns = []
		for (let i = 0; i < 10; i++) {
			btns.push(<button
				key={i}
				className='btn btn-rating'
				onMouseEnter={(e) => setColor(e, i + 1)}
				onMouseLeave={(e) => setColor(e, 0)}
				onClick={() => choiceRating(i + 1)}>
				<span>{i + 1}</span>
			</button>
			)
		}
		return <>{btns}</>
	}

	const Picker = () => {
		return (
			<div className="rating_picker-container">
				<div className="rating_picker">
					<span className='rating-star'>
						<StarIcon />
					</span>
					<div className="rating_picker-btns-container">
						<StarBtns />
					</div>
				</div>
			</div>
		)
	}

	const handleMenuItemClick = (action: 'EDIT' | 'DELETE') => {
		if (action === 'EDIT') {
			setShowConfirm(false)
			setShowPicker(true)
		} else if (action === 'DELETE') {
			addUserRate({ filmId, rating: -1 })
				.then(res => {
					if (res.message === 'OK') {
						setShowConfirm(false)
						setUserRatingInside(0)
						setRatingsCountInside(p => p - 1)
						setStarsCountInside(p => p - userRatingInside)
					}
				})
		}
	}

	const EditMenu = () => {
		return (
			<div className="rating-menu">
				<button className='btn rating-menu-btn' onClick={() => handleMenuItemClick('EDIT')}>
					<span>Edit</span>
				</button>
				<button className='btn rating-menu-btn' onClick={() => handleMenuItemClick('DELETE')}>
					<span>Remove</span>
				</button>
			</div>
		)
	}

	return (
		<div className="rating-container">
			<div className="rating">
				<div className="rating-value">{starsCountInside ? (starsCountInside / ratingsCountInside).toFixed(1) : 0}</div>
				<div className="rating-count">{ratingsCountInside}</div>
			</div>

			<div className="rating-choice-container" ref={ref}>
				<button
					className="btn rating-choice-btn"
					onClick={() => handleChoiseRate()}>
					{
						userRatingInside > 0
							? <div className='rating-star rating-star-mini'>
								<span>Change rating</span>
								<div className="rating-mini">
									<span>
										<StarIcon />
									</span>
									<span>{userRatingInside}</span>
								</div>
							</div>
							: <span>Rate the movie</span>
					}
				</button>
				{ showPicker ? <Picker /> : <></> }
				{ showConfirm ? <EditMenu /> : <></> }
			</div>
		</div>
	)
}
