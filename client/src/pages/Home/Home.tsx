import React, { useEffect, useRef, useState } from 'react'
import { ContentItemsList, Sidebar, PopupTrailer, HistorySlider, Promo } from '../../components'
import { getContent } from '../../API/contentApi'
import { IQuery } from '../../API/types'
import { useDispatch } from 'react-redux'
import { setLoading } from '../../store/action-creators/userActions'
import { useTypeSelector, useActions } from '../../hooks'
import './Home.css'

export const Home = () => {
	const dispatch = useDispatch()
	const { isShowTrailer, trailerKey } = useTypeSelector(state => state.content.trailer)
	const { height: headerHeight } = useTypeSelector(state => state.componentsInfo.header)

	const { setTrailer } = useActions()

	const [query, setQuery] = useState<IQuery>(
		{ page: 1, limit: 12, type: 'all', sort: 'popular', country: 0, genre: 0, year: '' }
	)
	const [firstContentLoad, setFirstContentLoad] = useState(true)

	const serachContentRef = useRef() as any

	const handlerScroll = () => {
		if (serachContentRef?.current?.clientHeight > window?.innerHeight) {
			const OFFSET_FROM_HEADER = 20
			const OFFSET_EL_FROM_TOP = serachContentRef?.current?.getBoundingClientRect().top
			const y = OFFSET_EL_FROM_TOP + window.pageYOffset - headerHeight - OFFSET_FROM_HEADER
			window.scrollTo({ top: y, behavior: 'smooth' })
		} else {
			serachContentRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
		}
	}

	useEffect(() => {
		getContent(query)
			.then(res => {
				if (res.message) {
					console.log('res.message from HOME: ', res.message)
					return
				}
				dispatch({ type: 'SET_CONTENT_LIST', payload: res })
				console.log('GET ALL RES: ', res)
			})
			.finally(() => {
				if (!firstContentLoad) handlerScroll()
				else setFirstContentLoad(false)
				dispatch(setLoading(false))
			})
		return () => {
			dispatch(setLoading(true))
		}
	}, [query])

	return (
		<>
			{
				isShowTrailer &&
					<PopupTrailer
						ytKey={trailerKey}
						visiblePopup={isShowTrailer}
						setVisiblePopup={setTrailer}
					/>
			}
			<Promo />
			<div className="home-content-wrapper" ref={serachContentRef}>
				<Sidebar setQuery={setQuery} />
				<ContentItemsList
					page={query.page!}
					limit={query.limit!}
					setQuery={setQuery}
				/>
			</div>
			<HistorySlider visibleCount={3} />
		</>
	)
}
