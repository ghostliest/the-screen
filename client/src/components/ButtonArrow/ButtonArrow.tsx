import React from 'react'
import { ReactComponent as ArrowIcon } from '../../assets/arrow.svg'
import { ButtonArrowProps } from './ButtonArrow.props'
import cn from 'classnames'
import styles from './ButtonArrow.module.css'

export const ButtonArrow = ({ className, arrow = 'right', onClick = () => {} }: ButtonArrowProps) => {
	return (
		<button
			className={cn('btn', styles.btnArrow, className, {
				[styles.left]: arrow === 'left'
			})}
			onClick={onClick}
		>
			<span>
				<ArrowIcon />
			</span>
		</button>
	)
}
