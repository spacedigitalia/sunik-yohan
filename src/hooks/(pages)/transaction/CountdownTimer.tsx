'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
    endTime: string;
}

export const CountdownTimer = ({ endTime }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 24,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(endTime).getTime();
            const distance = end - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
                <span className="font-medium">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span>:</span>
                <span className="font-medium">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span>:</span>
                <span className="font-medium">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            </div>
            <span>remaining</span>
        </div>
    );
}; 