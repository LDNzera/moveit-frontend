import { useContext } from 'react';

import { ChallengesContext } from '../contexts/ChallengesContext';
import { CountdownContext } from '../contexts/CountdownContext';

import styles from '../styles/components/ChallengeBox.module.css';

export function ChallengeBox() {
	const { activeChallenge, resetChallenge, completeChallenge } = useContext(ChallengesContext);
	const { resetCountdown } = useContext(CountdownContext);

	function handleChallengeCompleted() {
		completeChallenge();
		resetCountdown();
	}

	function handleChallengeFailed() {
		resetChallenge();
		resetCountdown();
	}

	return (
		<div className={styles.challengeBoxContainer}>
			{activeChallenge ? (
				<div className={styles.challengeActive}>
					<header>Earn {activeChallenge.amount} experience</header>

					<main>
						<img src={`icons/${activeChallenge.type}.svg`} />
						<strong>{activeChallenge.title}</strong>
						<p>{activeChallenge.description}</p>
					</main>

					<p />

					<footer>
						<button type="button" className={styles.challengeFailedButton} onClick={handleChallengeFailed}>
							Failed
						</button>
						<button
							type="button"
							className={styles.challengeCompletedButton}
							onClick={handleChallengeCompleted}
						>
							Completed
						</button>
					</footer>
				</div>
			) : (
				<div className={styles.challengeNotActive}>
					<strong>Ignite a cycle to receive challenges to be completed</strong>
					<p>
						<img src="icons/level-up.svg" alt="Level UP" />
						Complete them, gain experience and level up!
					</p>
				</div>
			)}
		</div>
	);
}
