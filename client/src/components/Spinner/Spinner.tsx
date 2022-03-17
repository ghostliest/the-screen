import React from 'react'
import cn from 'classnames'
import { ReactComponent as SpinnerIcon } from './Spinner.svg'
import { ISpinner } from './Spinner.props'
import styles from './Spinner.module.css'

export const Spinner = ({ fullScreen = false, className, style }: ISpinner) => {
	return (
		<div className={className} style={style}>
			<div className={cn(styles.spinnerContainer, { [styles.spinnerFullscreen]: fullScreen })}>
				<div className={cn(styles.spinner)}>
					<SpinnerIcon />
				</div>
			</div>
		</div>
	)
}
