import React, { MouseEventHandler } from 'react';

import './ReportButton.css';

interface ReportButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>;
    newMarkerLocation: { lng: number | null, lat: number | null };
    setNewMarkerLocation: (position: { lng: number | null, lat: number | null }) => void;
    userPosition?: { lng: number, lat: number } | null;
}

const ReportButton: React.FC<ReportButtonProps> = ({ onClick, newMarkerLocation, setNewMarkerLocation, userPosition }) => {

    const setNewMarker = () => {
		if (!userPosition) return 0;
            const newMarkerLocation = { lng: userPosition!.lng, lat: userPosition!.lat };
            setNewMarkerLocation(newMarkerLocation);
            
		return 1;
	}


    return (
        <button className='report-button' disabled={
            !userPosition
        }
                onClick={(event) => {
                    event.preventDefault();
                    setNewMarker();

                }} 
                
                aria-label='report ticketinspector' 
            > 
            
            <span role='img' aria-label='warning'>+</span>
        </button>
    );
};

export default ReportButton;