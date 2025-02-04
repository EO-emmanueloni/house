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
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            console.log('Google Sign-In Result:', result);

            // Dispatch to Redux
            dispatch(signInSuccess({
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
            }));

            // Persist to backend (optional)
            await fetch('http://localhost:3001/usersData', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });

            navigate('/');
        } catch (error) {
            console.log('Error signing in with Google:', error);
            dispatch(signInFailure(error.message));
        }
    };

    return <button onClick={handleGoogleSignIn}>Sign in with Google</button>;
}

export default OAuth;
