import React, { useEffect, useState, useMemo } from 'react';
import { Marker } from 'react-map-gl/maplibre';

import { MarkerData } from '../../MarkerContainer';
import MarkerPopUp from './MarkerPopUp';
import Backdrop from 'src/components/Miscellaneous/Backdrop/Backdrop';

import './OpacityMarker.css';

interface OpacityMarkerProps {
    markerData: MarkerData;
    index: number;
    isFirstOpen: boolean;
}

export const OpacityMarker: React.FC<OpacityMarkerProps> = ({ markerData, index, isFirstOpen }) => {
    const [opacity, setOpacity] = useState(0);
    const { timestamp, station, line, direction, isHistoric } = markerData;
    const [now, setNow] = useState(new Date().getTime());
    const [isMarkerOpen, setIsMarkerOpen] = useState(false);

    // By using useMemo, we can avoid recalculating the timestamp on every render
    const Timestamp = useMemo(() => {
        const tempTimestamp = new Date(timestamp);
        tempTimestamp.setHours(tempTimestamp.getHours() - 2); // Adjust for UTC to local

        return tempTimestamp;
    }, [timestamp]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (!isFirstOpen) {
            if (!isHistoric) {
                const calculateOpacity = () => {
                    const currentTime = new Date().getTime();
                    const elapsedTime = currentTime - Timestamp.getTime();
                    const newOpacity = Math.max(0, 1 - (elapsedTime / (15 * 60 * 1000)));
                    setOpacity(newOpacity);
                    if (newOpacity === 0) {
                        clearInterval(intervalId);
                    }
                };
                calculateOpacity(); // Initial calculation

                intervalId = setInterval(calculateOpacity, 5 * 1000); // every 5 seconds to avoid excessive rerenders
            } else {
                setOpacity(1);
            }
            return () => clearInterval(intervalId);
        }
    }, [Timestamp, isHistoric, isFirstOpen, opacity, station.name]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setNow(new Date().getTime());
        }, 60 * 1000); // Update every minute

        return () => clearInterval(intervalId); // Clean up on unmount
    }, []);

    if (opacity <= 0) {
        return null;
    }

    return (
        <>
            <Marker
                key={`${line}-${index}`}
                className='inspector-marker'
                latitude={station.coordinates.latitude}
                longitude={station.coordinates.longitude}
                opacity={opacity.toString()}
                onClick={() => setIsMarkerOpen(!isMarkerOpen)}
            >
                <span className='live' />
            </Marker>
            {isMarkerOpen && (
                <>
                <MarkerPopUp 
                    className={'open'}
                    title={'Title'}
                    note={'This is a random note about the repoort'}
                    category={'This is the category'}/>
                <Backdrop onClick={() => setIsMarkerOpen(false)} />

                
                </>
            )}
        </>

    );
};
