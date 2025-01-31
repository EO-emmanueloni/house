import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HouseLists() {
    const [houses, setHouses] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHouses = async () => {
            try {
                const res = await fetch('http://localhost:3001/houses'); // Fetch from JSON server
                if (!res.ok) {
                    throw new Error('Failed to fetch house data');
                }
                const data = await res.json();
                setHouses(data); // No need for `data.houses`, JSON server returns the array directly
            } catch (error) {
                setError(error.message);
            }
        };

        fetchHouses();
    }, []);

    return (
        <div className='house-container'>
            <Link to="sign-up">sign up</Link>
            <h2>Available Houses</h2>
            {error && <p className="error">{error}</p>}
            <div className='house-list'>
                {houses.map((house) => (
                    <div key={house.id} className='house-item'>
                        <h3>{house.address}</h3>
                        <p>Rent: ${house.rent}</p>
                        <p>Location: {house.location}</p>
                        <p>{house.description}</p>
                        <img src={house.image} alt={house.address} 
                       style={{
                        width: '50%',
                       }} className="house-image" /> {/* Display Image */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HouseLists;
