import './MarkerPopUp.css';

interface MarkerPopUpProps {
    
}

const MarkerPopUp: React.FC<MarkerPopUpProps> = () => {
    console.log('MarkerPopUp');
    return (
        <div className='marker-popup'>
            <h1>MakerPopUp</h1>
        </div>
    );
}

export default MarkerPopUp;