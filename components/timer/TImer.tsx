import React, { useEffect, useState } from 'react';

import styles from './Timer.module.css';

interface TimerProps {
    date: Date;
}

const Timer: React.FC<TimerProps> = ({ date }) => {
    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date().getTime();
            const targetTime = date.getTime();
            const remainingTime = targetTime - currentTime;

            setTimeRemaining(remainingTime);

            if (remainingTime <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [date]);

    const formatTime = (time: number): string => {
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / 1000 / 60) % 60);
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
        const days = Math.floor(time / (1000 * 60 * 60 * 24));

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div className={styles.main}>
            <p className={styles.timer}>{formatTime(timeRemaining)}</p>
        </div>
    );
};

export default Timer;
