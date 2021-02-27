import { useContext } from 'react';

import { CountdownContext } from '../contexts/CountdownContext';

import styles from '../styles/components/Countdown.module.css';

export function Countdown() {
	const { 
		minutes, 
		seconds, 
		hasFinished, 
		isActive, 
		startCountdownCycle, 
		resetCountdown 
	} = useContext(CountdownContext);

	const [ minuteLeft, minuteRight ] = String(minutes).padStart(2, '0').split('');
	const [ secondLeft, secondRight ] = String(seconds).padStart(2, '0').split('');

	return (
		<div>
			<div className={styles.countdownContainer}>
				<div>
					<span>{minuteLeft}</span>
					<span>{minuteRight}</span>
				</div>

				<span>:</span>

				<div>
					<span>{secondLeft}</span>
					<span>{secondRight}</span>
				</div>
			</div>

			{hasFinished ? (
				<button disabled className={styles.igniteCountdownButton}>
					Cycle completed

					<p className="fas fa-check-circle"></p>
				</button>
			) : (
				<>
					{isActive ? (
						<button
							type="button"
							className={`${styles.igniteCountdownButton} ${styles.igniteCountdownButtonActive}`}
							onClick={resetCountdown}
						>
							Abandon cycle

							<i className="fas fa-times"></i>
						</button>
					) : (
						<button type="button" className={styles.igniteCountdownButton} onClick={startCountdownCycle}>
							Ignite cycle
							
							<i className="fas fa-play"></i>
						</button>
					)}
				</>
			)}
		</div>
	);
}
