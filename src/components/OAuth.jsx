import { useDispatch } from 'react-redux';
import { signInSuccess, signInFailure } from '../redux/user/userSlice';
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';

function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });

            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            console.log('Google Sign-In Result:', result);

            // Dispatch user data to Redux
            const user = {
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
            };
            dispatch(signInSuccess(user));

            // Store in localStorage
            localStorage.setItem("user", JSON.stringify(user));

            // Backend API call (optional)
            const API_URL = process.env.NODE_ENV === 'production'
                ? 'https://your-deployed-api.com/usersData'
                : 'http://localhost:3001/usersData';

            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

            navigate('/');
        } catch (error) {
            console.error('Error signing in with Google:', error);
            dispatch(signInFailure(error.message));
        }
    };

    return <button onClick={handleGoogleSignIn}>Sign in with Google</button>;
}

export default OAuth;
