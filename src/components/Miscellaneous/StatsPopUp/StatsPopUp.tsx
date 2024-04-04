import { useState, useEffect } from 'react';
import { getNumberOfReportsInLast24Hours } from 'src/utils/dbUtils';
import './StatsPopUp.css';

interface StatsPopUpProps {
  className: string;
}

const StatsPopUp: React.FC<StatsPopUpProps> = ({ className }) => {
  const [message, setMessage] = useState('<p><strong>ca. 26000 Meldende</strong><br /> in Berlin</p>');
  const [popOut, setPopOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const timeForOneMessage = 3.5 * 1000;
  const timeForPopOutAnimation = 0.5 * 1000;

  const updateMessageAndShowPopup = async () => {
    const numberOfReports = await getNumberOfReportsInLast24Hours();
    setMessage(`<p><strong>${numberOfReports} Meldungen</strong><br /> heute in Berlin</p>`);
    setPopOut(true);
  };

  const hidePopupAfterAnimation = () => {
    setTimeout(() => {
      setPopOut(false);
      setTimeout(() => setIsVisible(false), timeForOneMessage);
    }, timeForPopOutAnimation);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      updateMessageAndShowPopup().then(hidePopupAfterAnimation);
    }, timeForOneMessage);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (popOut) {
      const timer = setTimeout(() => setPopOut(false), timeForPopOutAnimation);
      return () => clearTimeout(timer);
    }
  }, [popOut]);

  return (
    <div className={`
        stats-popup ${className} 
        ${popOut ? 'pop-out' : ''}
        ${!isVisible ? 'fade-out' : ''}`} 
        dangerouslySetInnerHTML={{ __html: message }} />
  );
};

export default StatsPopUp;
