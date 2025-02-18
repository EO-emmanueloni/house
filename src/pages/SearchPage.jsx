import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";

function SearchPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        type: "all",
        parking: false,
        furnished: false,
        sort: "created_at",
        order: "desc",
        offer: false
    });

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFormUrl = urlParams.get("searchTerm") || "";
        const typeFormUrl = urlParams.get("type") || "all";
        const parkingFormUrl = urlParams.get("parking") === "true";
        const furnishedFormUrl = urlParams.get("furnished") === "true";
        const sortFormUrl = urlParams.get("sort") || "created_at";
        const orderFormUrl = urlParams.get("order") || "desc";
        const offerFormUrl = urlParams.get("offer") === "true";

        setSidebarData({
            searchTerm: searchTermFormUrl,
            type: typeFormUrl,
            parking: parkingFormUrl,
            furnished: furnishedFormUrl,
            sort: sortFormUrl,
            order: orderFormUrl,
            offer: offerFormUrl
        });

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`http://localhost:3001/listingData?${searchQuery}`);
            const data = await res.json();
                if(data.length > 3) {
                    setShowMore(true);
                }

            setListings(data);
            setLoading(false);
        };

        fetchListings();
    }, [location.search]);

    const handleChange = (e) => {
        if (e.target.type === "checkbox") {
            setSidebarData({ ...sidebarData, [e.target.id]: e.target.checked });
        } else if (e.target.id === "searchTerm") {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value });
        } else if (e.target.id === "sort_order") {
            const [sort, order] = e.target.value.split("_");
            setSidebarData({ ...sidebarData, sort, order });
        } else {
            setSidebarData({ ...sidebarData, type: e.target.id });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.set("searchTerm", sidebarData.searchTerm);
        urlSearchParams.set("type", sidebarData.type);
        urlSearchParams.set("parking", sidebarData.parking);
        urlSearchParams.set("furnished", sidebarData.furnished);
        urlSearchParams.set("sort", sidebarData.sort);
        urlSearchParams.set("order", sidebarData.order);
        urlSearchParams.set("offer", sidebarData.offer);
        navigate(`/search?${urlSearchParams.toString()}`);
    };

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlSearchParams = new URLSearchParams(location.search);
        urlSearchParams.set("startIndex", startIndex);
        const searchQuery = urlSearchParams.toString();
        const res = await fetch(`http://localhost:3001/listingData?${searchQuery}`);
        const data = await res.json();
        if(data.length < 5) {
            setShowMore(true);
        } else {
            setShowMore(false);
        }
        setListings([...listings, ...data]);


    }

    return (
        <div>
            <div style={{ display: "flex", maxWidth: "800px", margin: "0 auto" }}>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                    <div>
                        <label>Search Term :</label>
                        <input type="text" id="searchTerm" placeholder="Search..." value={sidebarData.searchTerm} onChange={handleChange} />
                    </div>

                    <div>
                        <label>Type</label>
                        <div>
                            <input type="radio" id="all" onChange={handleChange} checked={sidebarData.type === "all"} />
                            <span>Rent and Sale</span>
                        </div>
                        <div>
                            <input type="radio" id="rent" onChange={handleChange} checked={sidebarData.type === "rent"} />
                            <span>Rent</span>
                        </div>
                        <div>
                            <input type="radio" id="sale" onChange={handleChange} checked={sidebarData.type === "sale"} />
                            <span>Sale</span>
                        </div>
                        <div>
                            <input type="checkbox" id="offer" onChange={handleChange} checked={sidebarData.offer} />
                            <span>Offer</span>
                        </div>
                    </div>

                    <div>
                        <label>Amenities</label>
                        <div>
                            <input type="checkbox" id="parking" onChange={handleChange} checked={sidebarData.parking} />
                            <span>Parking</span>
                        </div>
                        <div>
                            <input type="checkbox" id="furnished" onChange={handleChange} checked={sidebarData.furnished} />
                            <span>Furnished</span>
                        </div>
                    </div>

                    <div>
                        <label>Sort</label>
                        <select id="sort_order" onChange={handleChange} defaultValue="created_at_desc">
                            <option value="regularPrice_desc">Price high to low</option>
                            <option value="regularPrice_asc">Price low to high</option>
                            <option value="created_at_desc">Newest</option>
                            <option value="created_at_asc">Oldest</option>
                        </select>
                    </div>

                    <button style={{ padding: "10px", color: "white", background: "purple" }}>Search</button>
                </form>
            </div>
            <div>
                <h1>Listing Results:</h1>
                { !loading && listings.length === 0 && (<p>No listings found</p> )  }

                {loading  && (<p>Loading...</p>)}

               {
                !loading && listings.map((listing) => <ListingItem key={listing.id} listing={listing} />)
               }
            </div>
            {showMore && (
                <button
                    onClick={onShowMoreClick}
                        
                style={{
                    color: "white",
                    background: "green",
                    padding: "10px",
                    borderRadius: "5px",
                }}
                    
                >Show More</button>
            )}
        </div>
    );
}

export default SearchPage;
