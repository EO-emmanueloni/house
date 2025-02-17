import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
function Header() {
    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation(); // ✅ FIX: Get the current URL

    // 🔎 Handle search submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.set('search', searchTerm);
        const searchQuery = urlSearchParams.toString();
        
        navigate(`/search?${searchQuery}`); // ✅ FIX: Correct query format
    };

    // 🌍 Sync search input with URL params
    useEffect(() => {
        const urlSearchParams = new URLSearchParams(location.search);
        const search = urlSearchParams.get('search'); // ✅ FIX: No undefined variable
        setSearchTerm(search || ''); // If no search term, set it to an empty string
    }, [location.search]); // ✅ FIX: Depend on `location.search`


    return (
        <div className="header-container">
            <h2>Nest-wise</h2>

            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Search for houses" name='search'
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button>Search</button>
            </form>

            <div>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>

                {currentUser ? (
                    <Link to="/profile">
                        <img 
                            src={currentUser.photoURL} 
                            alt={currentUser.name} 
                            style={{ width: '30px', borderRadius: '50%' }} 
                        />
                    </Link>
                ) : (
                    <Link to="/sign-in">Sign In</Link>
                )}
            </div>
        </div>
    );
}

export default Header;
