import React, { useState } from 'react';
import LeaderElement from './LeaderElement';
import './LeaderBoard.css';
import { GetBlackSpotDto } from 'src/api/api';

interface LeaderBoardProps {
    leaderboard: GetBlackSpotDto[];
    isNewMarkerPopupOpen: boolean;
}

const LeaderBoard: React.FC<LeaderBoardProps> = ({ leaderboard, isNewMarkerPopupOpen }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleModal = () => {setIsExpanded(!isExpanded)};

    const renderLeaderElement = (element: GetBlackSpotDto, position: number) => (
        <LeaderElement
            key={element.id}
            position={position}
            title={element.name}
            score={element._count?.votes ?? 0}
        />
    );

    return (
        <div className={`leaderboard ${(isExpanded && !isNewMarkerPopupOpen ) ? 'expanded' : ''}`}>
            {leaderboard.length > 0 && renderLeaderElement(leaderboard[0], 1)}
            
            {(isExpanded && !isNewMarkerPopupOpen ) && (
                <div className='leaderboard-modal'>
                    {leaderboard.slice(1).map((element, index) =>
                        renderLeaderElement(element, index + 2)
                    )}
                </div>
            )}

            <div onClick={toggleModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16" style={{ cursor: 'pointer' }}>
                    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg>
            </div>
        </div>
    );
};

export default LeaderBoard;
