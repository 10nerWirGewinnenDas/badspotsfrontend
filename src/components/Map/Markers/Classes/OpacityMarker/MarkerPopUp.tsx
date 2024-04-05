import React, { useState } from 'react';
import './MarkerPopUp.css';

interface MarkerPopUpProps {
    className: string;
    title: string;
    note: string;
    category: string;
}

const MarkerPopUp: React.FC<MarkerPopUpProps> = ({ className, title, note, category }) => {
    const [upvotes, setUpvotes] = useState(0);
    const [isUpvoted, setIsUpvoted] = useState(false);

    // Function to handle upvote click
    const handleUpvote = () => {
        setUpvotes(prevUpvotes => prevUpvotes + 1);
        setIsUpvoted(prevState => !prevState);
        
        if (isUpvoted) {
            setUpvotes(prevUpvotes => prevUpvotes - 2);
        }
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
                <span onClick={handleUpvote} className={isUpvoted ? 'upvoted' : ''} >👍</span>
                <span>{upvotes}</span>
            </div>
        </div>
    );
}

export default MarkerPopUp;
