import './LeaderElement.css'

interface LeaderElementProps {
    position: number;
    title: string;
    score: number;
}

const LeaderElement: React.FC<LeaderElementProps> = ({ position, title, score }) => {
    return (
        <div className='leader-element'>
            <div>
                <span>{position}</span>
                <span>{title}</span>
                <span> - {score}</span>
            </div>
        </div>
    );
};

export default LeaderElement;