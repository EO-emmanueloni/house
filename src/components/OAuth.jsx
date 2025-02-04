import React from 'react'
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { app } from '../firebase';
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

function OAuth() {
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            console.log('result:', result);

            const res = await fetch('http://localhost:3001/usersData', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL}),
            });

            const data = await res.json();
            console.log('data:', data);
            navigate('/');


        } catch (error) {
            console.log('Error signing in with Google:', error);
        }
    }
  return (
    <button onClick={handleGoogleSignIn} type='button' className="oauth">Sign in with Google</button>
  )
}

export default OAuth