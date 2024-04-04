import { useState } from 'react';

import './StatsPopUp.css';

interface StatsPopUpProps {
    className: string;
}

const StatsPopUp: React.FC<StatsPopUpProps> = ({ className }) => {
    const [message, setMessage] = useState<string>('<p><strong>ca. 26000 meldende</strong><br /> in Berlin</p>');

    // reset message after 5 seconds
    setTimeout(() => {
        setMessage('<p><strong>500 Meldungen</strong><br /> heute in Berlin</p>');
    }, 5000);

    return (
        <div className={`stats-popup ${className}`} dangerouslySetInnerHTML={{ __html: message }} />
    );
}

export default StatsPopUp;