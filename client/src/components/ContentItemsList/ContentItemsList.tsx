import React from 'react'
import { useTypeSelector } from '../../hooks'
import { ContentItem, Pagination } from '..'
import { IContentItemsList } from './ContentItemsList.props'
import './ContentItemsList.css'

export const ContentItemsList = ({ page, limit, setQuery }: IContentItemsList) => {
	const { count, rows } = useTypeSelector(state => state.content.films)

	return (
		<div className="widget films-container">
			{
				<ul className="items-container">
					{
						rows?.map(i => (
							<li key={i.id}>
								<ContentItem content={{
									id: i.id,
									title: i.title,
									year: i.year,
									img: i.img,
									isFilm: i.isFilm,
									completionYear: i.completionYear,
									rating: {
										ratingsCount: i.ratingsCount,
										starsCount: i.starsCount
									},
									details: {
										youtubeTrailerKey: i.youtubeTrailerKey
									}
								}} />
							</li>
						))
					}
				</ul>
			}
			{!rows && <div className="films-notfound">Nothing found</div> }
			<Pagination page={page} count={count} limit={limit} setQuery={setQuery} />
		</div>
	)
}
