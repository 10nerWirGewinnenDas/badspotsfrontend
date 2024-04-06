import React, { useState } from 'react';
import LeaderElement from './LeaderElement';
import './LeaderBoard.css';
import { GetBlackSpotDto } from 'src/api/api';

interface LeaderBoardProps {
    leaderboard: GetBlackSpotDto[];
}

const LeaderBoard: React.FC<LeaderBoardProps> = ({ leaderboard }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleModal = () => setIsExpanded(!isExpanded);

    // Assuming you're using the `votes` as the score.
    // This assumes your LeaderElement component can accept the `score` as number.
    // Adjust the logic here as necessary.
    const renderLeaderElement = (element: GetBlackSpotDto, position: number) => (
        <LeaderElement
            key={element.id}
            position={position}
            title={element.name}
            score={element._count?.votes ?? 0}
        />
    );

    return (
        <div className='leaderboard'>
            {/* Ensure leaderboard has at least one element before trying to access it */}
            {leaderboard.length > 0 && renderLeaderElement(leaderboard[0], 1)}
            
            <div onClick={toggleModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16" style={{ cursor: 'pointer' }}>
                    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg>
            </div>

            {isExpanded && (
                <div className='leaderboard-modal'>
                    {leaderboard.slice(1).map((element, index) =>
                        renderLeaderElement(element, index + 2) // Adjust position since slice starts at 1
                    )}
                </div>
            )}
        </div>
    );
};

export default LeaderBoard;
