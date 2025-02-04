import React, { useState } from 'react';
import OAuth from '../components/OAuth';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(signInStart());

        try {
            const res = await fetch('http://localhost:3001/usersData');
            const users = await res.json();
            
            if (!Array.isArray(users)) throw new Error('Invalid response from server');

            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                alert('Sign in successful');
                dispatch(signInSuccess(user));
            } else {
                dispatch(signInFailure('Invalid email or password'));
            }
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    };

    return (
        <div className="form-container">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="text" 
                        id="email" 
                        placeholder="isioma@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password"
                        value={password} 
                        autoComplete='current-password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit">Sign In</button>
                <OAuth />
            </form>
        </div>
    );
}

export default SignIn;
