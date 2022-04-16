import React, { useEffect, useRef, useState } from 'react'
import { ContentItem } from '..'
import { useIntersection, useInterval } from '../../hooks'
import { ButtonArrow } from '../ButtonArrow/ButtonArrow'
import { IContentItemsSlider } from './ContentItemsSlider.props'
import './ContentItemsSlider.css'

export const ContentItemsSlider = ({ visibleCount, content, title }: IContentItemsSlider) => {
	const [transformValue, setTransformValue] = useState(0)
	const [arrLength, setArrLength] = useState(0)
	const [gap, setGap] = useState(0)
	const [elWidth] = useState(140)
	const [elWithGap, setElWithGap] = useState(0)
	const [slideCount, setSlideCount] = useState(0)
	const [counter, setCounter] = useState(0)
	const [sliderHover, setSliderHover] = useState(false)

	const carouselUlref = useRef() as any
	const carouselRef = useRef() as any

	const inViewport = useIntersection(carouselUlref, '-50px')

	useInterval(() => next(), sliderHover ? null : 1500)

	useEffect(() => {
		if (inViewport) {
			setSliderHover(false)
		} else {
			setSliderHover(true)
		}
	}, [inViewport])

	useEffect(() => {
		setArrLength(content.length)
		setGap(Number(getComputedStyle(carouselUlref?.current).gap.split('p')[0]))
	}, [])

	useEffect(() => {
		const calcSlideCount = () => {
			const count = visibleCount - arrLength
			return count < 0 ? Math.abs(count) : 0
		}

		if (gap > 0) {
			setElWithGap(elWidth + gap)
			setSlideCount(calcSlideCount())
		}
	}, [gap])

	const next = () => {
		if (counter < slideCount) {
			setTransformValue(p => p - elWithGap)
			setCounter(p => (p += 1))
		} else {
			setTransformValue(0)
			setCounter(0)
		}
	}

	const prev = () => {
		if (counter > 0) {
			setTransformValue(p => p + elWithGap)
			setCounter(p => (p -= 1))
		} else {
			setTransformValue(-(elWithGap * slideCount))
			setCounter(slideCount)
		}
	}

	return (
		<div className={`${visibleCount > 1 ? 'widget' : 'carousel-not-widget'} carousel-container`} ref={carouselRef}>
			<h3 className='carousel-title'>{title}</h3>
			<div
				className='carousel-wrapper'
				onMouseEnter={() => setSliderHover(true)}
				onMouseLeave={() => setSliderHover(false)}
			>
				<div
					className="scrollBar-wrapper"
					style={{ width: `${(visibleCount * elWithGap) - gap}px` }}
				>
					<div className="scrollBar-container" style={{ width: `${arrLength * elWithGap}px` }}>
						<ul
							className="carousel_items-container"
							style={{ transform: `translateX(${transformValue}px)` }}
							ref={carouselUlref}
						>
							{
								content.map(i => (
									<li key={i.id}>
										<ContentItem content={i} visibleRate={false} />
									</li>
								))
							}
						</ul>
					</div>
					{
						content.length <= visibleCount
							? <></>
							: <>
								<ButtonArrow
									className="carousel_button toLeftButton"
									arrow="left"
									onClick={prev}
								/>
								<ButtonArrow
									className="carousel_button toRightButton"
									arrow="right"
									onClick={next}
								/>
							</>
					}
				</div>
			</div>
		</div>
	)
}
