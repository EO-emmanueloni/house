import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import ListingItem from "../components/ListingItem";

// Initialize Swiper Navigation outside the component to avoid side effects
SwiperCore.use([Navigation]);

function Home() {
    const [offerListings, setOfferListings] = useState([]);
    const [saleListings, setSaleListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);

    useEffect(() => {
        const fetchOfferListings = async () => {
            try {
                const res = await fetch('http://localhost:3001/listingData?offer=true&limit=3');
                if (!res.ok) throw new Error('Failed to fetch offer listings');
                const data = await res.json();
                setOfferListings(data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchRentListings = async () => {
            try {
                const res = await fetch('http://localhost:3001/listingData?type=rent&limit=3');
                if (!res.ok) throw new Error('Failed to fetch rent listings');
                const data = await res.json();
                setRentListings(data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchSaleListings = async () => {
            try {
                const res = await fetch('http://localhost:3001/listingData?type=sale&limit=4');
                if (!res.ok) throw new Error('Failed to fetch sale listings');
                const data = await res.json();
                setSaleListings(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOfferListings();
        fetchRentListings();
        fetchSaleListings();
    }, []);

    return (
        <div>
            {/* Top Section */}
            <div>
                <h1>
                    Find your next <span>perfect</span>
                    <br />
                    place with ease
                </h1>
                <p>
                    Nest wise is a platform that connects you with the best real estate agents in your area.
                    <br />
                    We help you find the perfect place to call home.
                </p>
                <Link to='/search'>Get Started</Link>
            </div>

            {/* Swiper Carousel */}
            {offerListings.length > 0 && (
                <Swiper navigation>
                    {offerListings.map((listing) => (
                        <SwiperSlide key={listing.id}>
                            <div
                                style={{
                                    backgroundImage: `url(${listing.imageUrls[0]})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    height: '500px',
                                    width: '100%',
                                    borderRadius: '10px',
                                }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {/* Recent Offers Section */}
            {offerListings.length > 0 && (
                <div>
                    <div>
                        <h2>Recent Offers</h2>
                        <Link to='/search?offer=true'>Show more offers</Link>
                    </div>

                    <div>
                        {offerListings.map((listing) => (
                            <ListingItem listing={listing} key={listing.id} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
