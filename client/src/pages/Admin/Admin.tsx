import React, { useState } from 'react'
import {
	ButtonText,
	ButtonArrow,
	ButtonIconText,
	ModalContentOperations,
	ToggleSwitch,
	HistorySlider,
	Spinner
} from 'components'
import './Admin.css'

export const Admin = () => {
	const [visibleModal, setVisibleModal] = useState(false)
	const [mode, setMode] = useState<modeType>('CREATE')

	const [contentType, setContentType] = useState({ res: [{ id: 0, value: '1' }, { id: 1, value: '2' }, { id: 2, value: '3' }, { id: 3, value: '4' }, { id: 4, value: '5' }], selectedId: 0 })

	type modeType = 'CREATE' | 'UPDATE'

	const handleBtnClick = (mode: modeType) => {
		setVisibleModal(true)
		setMode(mode)
	}

	return (
		<>
			<div className='admin'>
				<div className="admin-btns-actions_wrapper">
					<ButtonText type='PRIMARY' placeholder='Content create' onClick={() => handleBtnClick('CREATE')} />
					<ButtonText type='PRIMARY' placeholder='Content edit' onClick={() => handleBtnClick('UPDATE')} />
					<ButtonText type='INACTIVE' placeholder='Person create' onClick={() => {}} />
					<ButtonText type='INACTIVE' placeholder='Person Edit' onClick={() => {}} />
					{
						visibleModal &&
							<ModalContentOperations
								isVisibleModal={visibleModal}
								setVisibleModal={setVisibleModal}
								mode={mode}
							/>
					}
				</div>

				<div className="like-storybook_wrapper">
					<h1>Components demo</h1>
					<div className="like-storybook_container">
						<ToggleSwitch
							setValue={id => setContentType(p => ({ ...p, selectedId: id }))}
							values={contentType.res}
						/>
						<ButtonArrow arrow='left' />
						<ButtonIconText
							onClick={() => {}}
							text='ButtonIconText'>
							{'+'}
						</ButtonIconText>
						<Spinner />
						<HistorySlider visibleCount={3} />
					</div>
				</div>
			</div>
		</>
	)
}
