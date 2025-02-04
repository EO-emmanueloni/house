import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
    const { currentUser } = useSelector(state => state.user);

    return (
        <div className="header-container">
            <h2>Nest-wise</h2>

            <form>
                <input type="text" placeholder="Search for houses"  />
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
