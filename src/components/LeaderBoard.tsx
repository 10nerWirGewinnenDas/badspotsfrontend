import './LeaderBoard.css'

interface LeaderBoardProps {
    leaderboard: any;
}

const LeaderBoard: React.FC<LeaderBoardProps> = ({ leaderboard }) => {
    return (
        <div className='leaderboard'>
            <div>
                <span>#1</span>
                <span>Kaputte Rolltreppe</span>
                <span> - 5</span>
            </div>
            <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
            </svg>
            </div>
        </div>
    );
};

export default LeaderBoard;