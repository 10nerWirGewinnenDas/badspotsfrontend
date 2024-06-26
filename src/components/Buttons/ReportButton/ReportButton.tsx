import React, { MouseEventHandler } from 'react';

import './ReportButton.css';
import {berlinViewPosition} from "../../Map/Map";

interface ReportButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>;
    newMarkerLocation: { lng: number | null, lat: number | null };
    setNewMarkerLocation: (position: { lng: number | null, lat: number | null }) => void;
    userPosition?: { lng: number, lat: number } | null;
    isNewMarkerPopupOpen: boolean;
    setIsNewMarkerPopupOpen: (isOpen: boolean) => void;
}

const ReportButton: React.FC<ReportButtonProps> = ({ onClick, newMarkerLocation, setNewMarkerLocation, userPosition , isNewMarkerPopupOpen, setIsNewMarkerPopupOpen}) => {

    const setNewMarker = () => {
		if (!userPosition) {
      const newMarkerLocation = { lng: berlinViewPosition.lng, lat: berlinViewPosition.lat };
      setIsNewMarkerPopupOpen(true);
      setNewMarkerLocation(newMarkerLocation);
    }else{
      const newMarkerLocation = { lng: userPosition!.lng, lat: userPosition!.lat };
      setIsNewMarkerPopupOpen(true);
      setNewMarkerLocation(newMarkerLocation);
    }
		return 1;
	}


    return (
        <button className='report-button'
                onClick={(event) => {
                    event.preventDefault();
                    setNewMarker();

                }} 
                
                aria-label='report ticketinspector' 
            > 
            
            <span aria-label='warning' className='cross'></span>
        </button>
    );
};

export default ReportButton;