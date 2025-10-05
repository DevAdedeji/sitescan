"use client"

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface ScoreCardProps {
    percentage: number
}
export const LighthouseScoreCard = ({ percentage }: ScoreCardProps) => {
    return (
        <div className="flex flex-col gap-2">
            <CircularProgressbar value={percentage} text={`${percentage}%`} />
        </div>
    )
}