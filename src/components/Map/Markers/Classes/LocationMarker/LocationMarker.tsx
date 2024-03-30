import React, { useCallback, useEffect } from 'react';
import { Marker } from 'react-map-gl/maplibre';

import { watchPosition} from '../../../../../utils/mapUtils';


import './LocationMarker.css';

interface LocationMarkerProps {
    userPosition: {lng: number, lat: number} | null;
    setUserPosition: (position: {lng: number, lat: number} | null) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ userPosition, setUserPosition }) => {

        const fetchPosition = useCallback(async () => {
            const stopWatching = await watchPosition(setUserPosition);
            return () => stopWatching();
        }, []);

        useEffect(() => {
            fetchPosition();
        }, [fetchPosition]);

    return (
        <div data-testid='location-marker'>
            {userPosition && (
                <Marker
                    className='location-marker'
                    latitude={userPosition.lat}
                    longitude={userPosition.lng}

            >
                <span></span>
            </Marker>
            )}
        </div>
    );
};

export default LocationMarker;
