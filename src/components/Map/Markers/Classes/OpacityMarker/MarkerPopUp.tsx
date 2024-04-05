import React, { useState } from 'react'; // Import useState for the upvote functionality
import './MarkerPopUp.css';

interface MarkerPopUpProps {
    className: string;
    title: string;
    note: string;
    category: string;
}

const MarkerPopUp: React.FC<MarkerPopUpProps> = ({className, title, note, category}) => {
    const [upvotes, setUpvotes] = useState(0);

    // Function to handle upvote click
    const handleUpvote = () => {
        setUpvotes(prevUpvotes => prevUpvotes + 1);
    };

    return (
        <div className={`marker-popup ${className}`}>
            <h1>{title}</h1>
            <div>
                <h2>Note:</h2>
                <p>{note}</p>
            </div>
            <div>
                <h2>Category:</h2>
                <p>Category: {category}</p>
            </div>
            <div>
                <span onClick={handleUpvote}>👍</span>
                <span>{upvotes}</span>
            </div>
        </div>
    );
}

export default MarkerPopUp;
