import React, { useEffect, useRef, useState } from 'react'
import { Modal, Multiselect, SearchInput, Spinner, ToggleSwitch } from 'components'
import { getFullContent, create, update } from 'API/contentApi'
import { IFullContent, IMetaItem } from 'store/types/contentTypes'
import { IContentInfo, ICustomInput, IMetaInfo, IModalContentOperations, IModalContentScreen } from './ModalContentOperations.props'
import './ModalContentOperations.css'

export const ModalContentOperations = ({ isVisibleModal, setVisibleModal, mode }: IModalContentOperations) => {
	const [editContentId, setEditContentId] = useState(0)
	const [isLoading, setIsLoading] = useState(true)

	return (
		<Modal isVisibleModal={isVisibleModal} setVisibleModal={setVisibleModal}>
			{
				mode === 'UPDATE' && !editContentId
					?	<ModalSearchScreen setEditContentId={setEditContentId} />
					: <ModalContentScreen
						editContentId={editContentId}
						setVisibleModal={setVisibleModal}
						isLoading={isLoading}
						setIsLoading={setIsLoading}
						mode={mode}
					/>
			}
		</Modal>
	)
}

const ModalSearchScreen = ({ setEditContentId }: { setEditContentId: React.Dispatch<React.SetStateAction<number>> }) => {
	const handleSuggestItemClick = (id: number) => {
		setEditContentId(id)
	}

	return (
		<div className='search_input-modal'>
			<SearchInput
				autoFocus={true}
				searchType='film'
				placeholder='Enter the name of the edited content'
				handleSuggestItemClick={handleSuggestItemClick}
				redirect={false}
			/>
		</div>
	)
}

export const metaInitialState: IMetaInfo = {
	view: [],
	initial: [],
	to: { add: [], delete: [] }
}

const infoInitialState = <T extends unknown>(state: T): IContentInfo<T> => {
	return { initial: state, to: state }
}

const ModalContentScreen = ({ editContentId, setVisibleModal, isLoading, setIsLoading, mode }: IModalContentScreen) => {
	const [title, setTitle] = useState<IContentInfo<string>>(infoInitialState(''))
	const [year, setYear] = useState<IContentInfo<number | string>>(infoInitialState(''))
	const [completionYear, setCompletionYear] = useState<IContentInfo<number | string>>(infoInitialState(''))
	const [isFilm, setIsFilm] = useState<IContentInfo<boolean>>(infoInitialState(true))
	const [img, setImg] = useState<IContentInfo<any>>(infoInitialState(undefined))

	const [duration, setDuration] = useState<IContentInfo<number | string>>(infoInitialState(''))
	const [seasonCount, setSeasonCount] = useState<IContentInfo<number | string>>(infoInitialState(''))
	const [ageRating, setAgeRating] = useState<IContentInfo<number | string>>(infoInitialState(''))
	const [youtubeTrailerKey, setYoutubeTrailerKey] = useState<IContentInfo<string>>(infoInitialState(''))
	const [description, setDescription] = useState<IContentInfo<string>>(infoInitialState(''))

	const [actors, setActors] = useState<IMetaInfo>(metaInitialState)
	const [directors, setDirectors] = useState<IMetaInfo>(metaInitialState)
	const [genres, setGenres] = useState<IMetaInfo>(metaInitialState)
	const [countries, setCountries] = useState<IMetaInfo>(metaInitialState)

	const [isSubmit, setIsSubmit] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')

	const fileInputRef = useRef({}) as any

	const handleOpenFileDialog = () => {
		fileInputRef?.current?.click()
	}

	const handleOnFilesAdded = (e: any) => {
		setImg(p => ({ ...p, to: e.target.files[0] }))
	}

	const handleModalSubmit = () => {
		const fd = new FormData()
		const fdNames: {obj: IMetaInfo | IContentInfo<any>, name: string}[] = [
			{ obj: img, name: 'img' },
			{ obj: isFilm, name: 'isFilm' },
			{ obj: title, name: 'title' },
			{ obj: year, name: 'year' },
			{ obj: completionYear, name: 'completionYear' },
			{ obj: duration, name: 'duration' },
			{ obj: seasonCount, name: 'seasonCount' },
			{ obj: ageRating, name: 'ageRating' },
			{ obj: youtubeTrailerKey, name: 'youtubeTrailerKey' },
			{ obj: description, name: 'description' },
			{ obj: actors, name: 'actors' },
			{ obj: directors, name: 'directors' },
			{ obj: genres, name: 'genres' },
			{ obj: countries, name: 'countries' }
		]

		for (const { obj: { initial, to }, name } of fdNames) {
			if (name === 'img' && (to?.size !== initial?.size) && to !== undefined) {
				fd.append('img', to)
			} else if (
				(name !== 'img' && (typeof to === 'object' && (to.add.length > 0 || to.delete.length > 0))) ||
				(typeof to === 'number' && to > 0) ||
				(typeof to === 'string' && to !== initial && to.length >= 1) ||
				(typeof to === 'boolean')
			) {
				fd.append(name, JSON.stringify(to))
			}
		}

		const fdKeys = Object.keys(Object.fromEntries(fd))
		if (fdKeys.length === 0) {
			setErrorMessage('Not a single field has been changed')
			return
		}

		setIsSubmit(true)

		if (mode === 'CREATE') {
			create(fd)
				.then(res => {
					setIsSubmit(false)
					if (res.message) {
						setErrorMessage(res.message)
					} else if (res.status === 'ok') {
						setVisibleModal(false)
					}
				})
		} else if (mode === 'UPDATE') {
			update(fd, editContentId)
				.then(res => {
					setIsSubmit(false)
					if (res.message) {
						setErrorMessage(res.message)
					} else if (res.status === 'ok') {
						setVisibleModal(false)
					}
				})
		}
	}

	const handleInitialState = (prev: IMetaInfo, meta: IMetaItem[]) => {
		return { ...prev, view: meta, initial: meta.map(i => i.id) }
	}

	const ModalButtonSubmit = () => {
		const [type, setType] = useState('Create')
		const [value, setValue] = useState('Film')

		useEffect(() => {
			mode === 'CREATE' ? setType('Create') : setType('Edit')
		}, [])

		useEffect(() => {
			isFilm.to ? setValue('Film') : setValue('TV Series')
		}, [isFilm.to])

		return (
			<button
				className="btn btn-text btn-primary modal-content-operations_btn-submit"
				onClick={handleModalSubmit}
			>
				{	isSubmit ? <Spinner /> : type + ' ' + value	}
			</button>
		)
	}

	useEffect(() => {
		if (editContentId) {
			getFullContent(editContentId)
				.then((res: IFullContent) => {
					setIsFilm(prev => ({ ...prev, initial: res.isFilm, to: res.isFilm }))
					setTitle(prev => ({ ...prev, initial: res.title }))
					setYear(prev => ({ ...prev, initial: res.year }))
					setCompletionYear(prev => ({ ...prev, initial: res.completionYear! }))
					setDuration(prev => ({ ...prev, initial: res.details.duration }))
					setSeasonCount(prev => ({ ...prev, initial: res.details.seasonCount! }))
					setAgeRating(prev => ({ ...prev, initial: res.details.ageRating }))
					setYoutubeTrailerKey(prev => ({ ...prev, initial: res.details.youtubeTrailerKey }))
					setDescription(prev => ({ ...prev, initial: res.details.description }))
					setActors(prev => handleInitialState(prev, res.actors))
					setDirectors(prev => handleInitialState(prev, res.directors))
					setGenres(prev => handleInitialState(prev, res.genres))
					setCountries(prev => handleInitialState(prev, res.countries))
					fetch(`${process.env.REACT_APP_API_IMAGES_URL + res.img}`)
						.then(data => data.blob())
						.then((blob: any) => setImg(prev => ({ ...prev, initial: new Blob([blob]) })))
						.then(() => setIsLoading(false))
				})
		} else {
			setIsLoading(false)
		}
	}, [editContentId])

	return (
		<>
			{
				isLoading
					? <Spinner />
					:		<div className="modal-content-operations_container">
						<header className="modal-content-operations_header">
							<h1>{mode === 'CREATE' ? 'Create' : 'Edit'}</h1>
							<ToggleSwitch
								setValue={(id) => setIsFilm(p => ({ ...p, to: !id }))}
								values={[{ id: 0, placeholder: 'Film', value: true }, { id: 1, placeholder: 'TV Series', value: false }]}
								initialPos={Number(!isFilm.to)}
							/>
						</header>
						<main className="modal-content-operations_body">
							<section className="section-details">
								<div className="img_container" onClick={handleOpenFileDialog}>
									<div className="img_wrapper">
										<div className="info_img">
											<div className="select_poster-container">
												<input type="file" multiple={false} ref={fileInputRef} onChange={(e) => handleOnFilesAdded(e)} />
											</div>
											{
												img?.to || img?.initial
													? <div className="img_upload">
														<span className='info_img-text img_text'>{'Change poster'}</span>
														<img src={URL.createObjectURL(img?.to || img?.initial)} alt="poster" />
													</div>
													: <span className='info_img-text'>{'Add poster'}</span>
											}
										</div>
									</div>
								</div>
								<div className="inputs_form">
									<div className="inputs_group-main">
										<CustomInput
											className='content-input'
											type='text'
											placeholder='title'
											value={title}
											onChange={(v: string) => setTitle(p => ({ ...p, to: v }))}
										/>

										<div className="inputs_group-mini">
											<div className="inputs_group-mini-first">
												{
													isFilm.to
														? <CustomInput
															className='content-input'
															type='number'
															placeholder='year'
															value={year}
															onChange={(v: number) => setYear(p => ({ ...p, to: v }))}
														/>
														: <div className="inputs_group-mini-item">
															<CustomInput
																className='content-input'
																type='number'
																placeholder='year'
																value={year}
																onChange={(v: number) => setYear(p => ({ ...p, to: v }))}
															/>
															<CustomInput
																className='content-input'
																type='number'
																placeholder='completion year'
																value={completionYear}
																onChange={(v: number) => setCompletionYear(p => ({ ...p, to: v }))}
															/>
														</div>
												}
												{
													!isFilm.to
														? <div className='inputs_group-mini-item'>
															<CustomInput
																className='content-input'
																type="number"
																placeholder='duration'
																value={duration}
																onChange={(v: number) => setDuration(p => ({ ...p, to: v }))}
															/>
															<CustomInput
																className='content-input'
																type="number"
																placeholder='season count'
																value={seasonCount}
																onChange={(v: number) => setSeasonCount(p => ({ ...p, to: v }))}
															/>
														</div>
														: <CustomInput
															className='content-input'
															type="number"
															placeholder='duration'
															value={duration}
															onChange={(v: number) => setDuration(p => ({ ...p, to: v }))}
														/>
												}
											</div>
											<div className="inputs_group-mini-second">
												<CustomInput
													className='content-input'
													type="number"
													placeholder='ageRating'
													value={ageRating}
													onChange={(v: number) => setAgeRating(p => ({ ...p, to: v }))}
												/>
												<CustomInput
													className='content-input'
													type="text"
													placeholder='YouTube trailer key'
													value={youtubeTrailerKey}
													onChange={(v: string) => setYoutubeTrailerKey(p => ({ ...p, to: v }))}
												/>
											</div>
										</div>
									</div>
									<div className="content-textarea_container">
										<CustomInput
											className='content-input content-area'
											type="text"
											placeholder='description'
											value={description}
											onChange={(v: string) => setDescription(p => ({ ...p, to: v }))}
											inputType='textarea'
										/>
									</div>
								</div>
							</section>
							<section className="section-meta">
								<div className="multiselect-group">
									<Multiselect placeholder='country' searchType='country' menuValues={countries} setMenuValues={setCountries} />
									<Multiselect placeholder='genre' searchType='genre' menuValues={genres} setMenuValues={setGenres} />
									<Multiselect placeholder='actor' searchType='actor' menuValues={actors} setMenuValues={setActors} />
									<Multiselect placeholder='director' searchType='director' menuValues={directors} setMenuValues={setDirectors} />
								</div>
							</section>
						</main>
						<footer className='modal-content-operations_footer'>
							<ModalButtonSubmit />
							{errorMessage && <div className="modal-content-operations_footer-err-mes">{errorMessage}</div>}
						</footer>
					</div>
			}
		</>
	)
}

const CustomInput = ({ className, type, placeholder, value: initialValue, onChange, inputType = 'input' }: ICustomInput) => {
	const [value, setValue] = useState(initialValue.to ? initialValue.to : initialValue.initial)
	const inputRef = useRef({}) as any

	const handleChange = (val: string) => {
		setValue(val)
		onChange(val)
	}

	return (
		<div className='custom_input-group'>
			{
				inputType === 'input'
					? <input
						className={className}
						type={type}
						value={value}
						onChange={(e) => handleChange(e.target.value)}
						ref={inputRef}
					/>
					: <textarea
						className={className}
						value={value}
						onChange={(e) => handleChange(e.target.value)}
						ref={inputRef}
					/>
			}
			<label
				className={`custom_input-label ${value ? 'custom_input-label_active' : 'custom_input-label_noactive'}`}
				onClick={() => inputRef?.current?.focus()}>
				{placeholder}
			</label>
		</div>
	)
}
