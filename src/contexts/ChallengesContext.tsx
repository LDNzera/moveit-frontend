import { createContext, useState, ReactNode, useEffect } from 'react';

import Cookies from 'js-cookie';

import { LevelUpModal } from '../components/LevelUpModal';

import challenges from '../../challenges.json';

interface Challenge {
	type: 'body' | 'eye' | 'brain';
	title: string;
	description: string;
	amount: number;
}

interface ChallengesContextData {
	level: number;
	currentExperience: number;
	experienceToNextLevel: number;
	challengesCompleted: number;
	activeChallenge: Challenge;

	levelUp: () => void;
	igniteNewChallenge: () => void;
	resetChallenge: () => void;
	completeChallenge: () => void;
	closeLevelUpModal: () => void;
}

interface ChallengesProviderProps {
	children: ReactNode;

	level: number;
	currentExperience: number;
	challengesCompleted: number;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children, ...rest }: ChallengesProviderProps) {
	const [ level, setLevel ] = useState(rest.level ?? 1);
	const [ currentExperience, setCurrenteExperience ] = useState(rest.currentExperience ?? 0);
	const [ challengesCompleted, setChallengesCompleted ] = useState(rest.challengesCompleted ?? 0);

	const [ activeChallenge, setActiveChallenge ] = useState(null);

	const [ isLevelUpModalOpen, setIsLevelUpModalOpen ] = useState(false);

	const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

	useEffect(() => {
		Notification.requestPermission();
	}, []);

	useEffect(
		() => {
			Cookies.set('level', String(level));
			Cookies.set('currentExperience', String(currentExperience));
			Cookies.set('challengesCompleted', String(challengesCompleted));
		},
		[ level, currentExperience, challengesCompleted ]
	);

	function levelUp() {
		setLevel(level + 1);
		setIsLevelUpModalOpen(true);

		new Audio('/notification-level-up.mp3').play();
	}

	function closeLevelUpModal() {
		setIsLevelUpModalOpen(false);
	}

	function igniteNewChallenge() {
		const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
		const challenge = challenges[randomChallengeIndex];

		setActiveChallenge(challenge);

		new Audio('/notification.mp3').play();

		if (Notification.permission === 'granted') {
			new Notification('🚀 | Move.it • New challenge!', {
				body: `Earn ${challenge.amount} experience (XP) with this challenge.`,
				icon: 'favicon.png'
			});
		}
	}

	function resetChallenge() {
		setActiveChallenge(null);
	}

	function completeChallenge() {
		if (!activeChallenge) {
			return;
		}

		const { amount } = activeChallenge;

		let finalExperience = currentExperience + amount;

		if (finalExperience >= experienceToNextLevel) {
			finalExperience = finalExperience - experienceToNextLevel;
			levelUp();
		}

		setCurrenteExperience(finalExperience);
		setActiveChallenge(null);
		setChallengesCompleted(challengesCompleted + 1);
	}

	return (
		<ChallengesContext.Provider
			value={{
				level,
				currentExperience,
				experienceToNextLevel,
				challengesCompleted,
				levelUp,
				igniteNewChallenge,
				activeChallenge,
				resetChallenge,
				completeChallenge,
				closeLevelUpModal
			}}
		>
			{children}

			{ isLevelUpModalOpen && <LevelUpModal /> }
		</ChallengesContext.Provider>
	);
}
