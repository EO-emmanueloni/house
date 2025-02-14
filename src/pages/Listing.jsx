import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { FaBed, FaBath, FaMapMarkerAlt, FaParking, FaChair } from 'react-icons/fa';

export default function Listing() {
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await fetch(`http://localhost:3001/listingData/${params.listingId}`);

                if (!res.ok) throw new Error('Failed to fetch listing');
                
                const data = await res.json();
                setListing(data);
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [params.listingId]);

    return (
        <div>
            {/* Loading & Error Messages */}
            {loading && <p>Loading...</p>}
            {error && !loading && <p style={{ color: 'red' }}>Something went wrong. Please try again.</p>}

            {/* Render only if listing is available */}
            {listing && !loading && !error && (
                <>
                    {/* Image Slider */}
                    <Swiper modules={[Navigation]} navigation>
                        {(listing?.imageUrls || []).map((url) => (
                            <SwiperSlide key={url}>
                                <div
                                    style={{
                                        backgroundImage: `url(${url})`,
                                        height: '300px',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                ></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Location */}
                    {listing?.location && (
                        <div>
                            <FaMapMarkerAlt style={{ color: 'green' }} /> {listing.location}
                        </div>
                    )}

                    {/* Sale/Rent Badge */}
                    <p style={{ color: 'white', padding: '10px', backgroundColor: 'red', borderRadius: '5px', width: 'fit-content' }}>
                        {listing?.type === 'rent' ? 'For Rent' : 'For Sale'} - ${listing?.price?.toLocaleString()}
                    </p>

                    {/* Discount Offer */}
                    {listing?.offer && listing?.regularPrice && listing?.discountPrice && (
                        <p style={{ color: 'white', padding: '10px', backgroundColor: 'green', borderRadius: '5px', width: 'fit-content' }}>
                            ${(+listing.regularPrice - +listing.discountPrice).toLocaleString()} Discount
                        </p>
                    )}

                    {/* Description */}
                    {listing?.description && <p>{listing.description}</p>}

                    {/* Bedrooms & Bathrooms */}
                    {(listing?.bedrooms !== undefined || listing?.bathrooms !== undefined) && (
                        <ul style={{ listStyle: 'none', padding: '5px', display: 'flex', gap: '10px' }}>
                            {/* Bedrooms */}
                            <li>
                                <FaBed style={{ color: 'green', fontSize: 'large' }} />
                                {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
                            </li>

                            {/* Bathrooms */}
                            <li>
                                <FaBath style={{ color: 'green', fontSize: 'large' }} />
                                {listing?.bathrooms 
                                    ? listing.bathrooms > 1 
                                        ? `${listing.bathrooms} Bathrooms` 
                                        : '1 Bathroom' 
                                    : 'Not specified'}
                            </li>
                            <li>
                                <FaParking style={{ color: 'green', fontSize: 'large' }} />
                                {listing.parking ? 'parking' : 'No parking'}
                            </li>
                            <li>
                                <FaChair style={{ color: 'green', fontSize: 'large' }} />
                                {listing.furniture ? 'Furnished' : 'Not furnished'}
                            </li>
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}
