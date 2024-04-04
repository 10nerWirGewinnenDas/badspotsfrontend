import { useState, useEffect } from 'react';

import './StatsPopUp.css';

interface StatsPopUpProps {
    className: string;
}

const StatsPopUp: React.FC<StatsPopUpProps> = ({ className }) => {
    const [message, setMessage] = useState('<p><strong>ca. 26000 meldende</strong><br /> in Berlin</p>');
    const [popOut, setPopOut] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMessage('<p><strong>500 Meldungen</strong><br /> heute in Berlin</p>');
            setPopOut(true);

            setTimeout(() => {
                setPopOut(false);
                setTimeout(() => setIsVisible(false), 3500); // Start hiding after the second message is shown
            }, 500); // This should match the duration of the pop-out animation
        }, 3.5 * 1000);

        // Cleanup function to clear timeout if component unmounts
        return () => clearTimeout(timer);
    }, []);

    // Listen for popOut changes to apply pop-out animation on message change
    useEffect(() => {
        if (popOut) {
            const timer = setTimeout(() => setPopOut(false), 500);
            return () => clearTimeout(timer);
        }
    }, [popOut]);

    return (
        <div className={`stats-popup ${className} ${popOut ? 'pop-out' : ''} ${!isVisible ? 'fade-out': ''}`}dangerouslySetInnerHTML={{ __html: message }} />
    );
}

export default StatsPopUp;
