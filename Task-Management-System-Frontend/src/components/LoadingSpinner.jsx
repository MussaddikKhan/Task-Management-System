/** A loading spinner while the data is being fetched */

import React from  'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({
    message = 'Loading...'
}) => {
    return (
    <div className='loading-container'>
        <div className="spinner">
            <p className='loading-message'>{message}</p>
        </div>
    </div>
    );
};

export default LoadingSpinner;
