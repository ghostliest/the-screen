import React, { useRef } from 'react'
import { useOnClickEsc, useOnClickOutside } from 'hooks'
import { IModal } from './Modal.props'
import './Modal.css'

export const Modal = ({ children, isVisibleModal, setVisibleModal }: IModal) => {
	const modalRef = useRef({}) as any

	useOnClickOutside(modalRef, () => setVisibleModal(false))
	useOnClickEsc(isVisibleModal, () => setVisibleModal(false))

	return (
		<div className="modal-container">
			<div className="modal-wrapper">
				<div className="modal-main-wrapper" ref={modalRef}>
					{ children }
				</div>
			</div>
		</div>
	)
}
