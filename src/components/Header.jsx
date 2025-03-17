import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import ProfileAvatar from '../components/ProfileAvatar';

function Header() {
    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Handle search submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlSearchParams = new URLSearchParams();
        urlSearchParams.set('search', searchTerm);
        navigate(`/search?${urlSearchParams.toString()}`);
    };

    // Sync search input with URL params
    useEffect(() => {
        const urlSearchParams = new URLSearchParams(location.search);
        const search = urlSearchParams.get('search');
        setSearchTerm(search || '');
    }, [location.search]);

    return (
        <header className="bg-white shadow-sm py-4 px-6">
            <div className="flex items-center justify-between">
                {/* Logo */}
                <Link to="/">
                    <h2 className="text-xl font-bold text-red-500">Nest-wise</h2>
                </Link>

                {/* Search */}
                <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-4">
                    <div className="flex">
                        <input 
                            type="text" 
                            placeholder="Search for houses" 
                            name="search"
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border rounded-l"
                        />
                        <button 
                            className="bg-red-500 text-white px-4 rounded-r"
                            type="submit"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* Navigation */}
                <div className="flex items-center gap-4">
                    <NavLink 
                        to="/about"
                        className={({ isActive }) => 
                            isActive ? "font-semibold text-red-500" : "text-gray-700"
                        }
                    >
                        About
                    </NavLink>
                    
                    {currentUser ? (
                        <Link to="/profile">
                            <ProfileAvatar
                             name={currentUser.name || currentUser.username} 
                             photoURL={currentUser.photoURL} 
                             size="50px"
                            />
                        </Link>
                    ) : (
                        <>
                            <Link 
                                to="/sign-in"
                                className="bg-red-500 text-white px-4 py-1.5 rounded"
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/sign-up"
                                className="bg-red-500 text-white px-4 py-1.5 rounded"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;