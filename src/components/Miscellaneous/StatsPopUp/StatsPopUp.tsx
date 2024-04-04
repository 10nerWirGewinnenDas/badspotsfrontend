import { useState, useEffect } from 'react';

import './StatsPopUp.css';

interface StatsPopUpProps {
    className: string;
}

const StatsPopUp: React.FC<StatsPopUpProps> = ({ className }) => {
    const [message, setMessage] = useState<string>('<p><strong>ca. 26000 meldende</strong><br /> in Berlin</p>');
    const [popOut, setPopOut] = useState<boolean>(false);

    // reset message after 5 seconds
    setTimeout(() => {
        setMessage('<p><strong>500 Meldungen</strong><br /> heute in Berlin</p>');
    }, 3.5*1000);

    useEffect(() => {
        setPopOut(true);
        setTimeout(() => setPopOut(false), 500); // assuming the animation duration is 500ms
    }, [message]);

    return (
        <div className={`stats-popup ${className} ${popOut ? 'pop-out' : ''}`} dangerouslySetInnerHTML={{ __html: message }} />
    );
}

export default StatsPopUp;