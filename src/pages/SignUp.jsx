import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import OAuth from "../components/OAuth";

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');
    const [detailedError, setDetailedError] = useState('');
    const navigate = useNavigate();

    // Function to format phone number to international format
    const formatPhoneNumber = (mobile) => {
        // Ensure it starts with +234 if it's a Nigerian number
        if (mobile.startsWith("0")) {
            return "+234" + mobile.slice(1);
        }
        return mobile;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setDetailedError('');

        // Validate passwords match
        if (password !== password2) {
            setError("Passwords don't match");
            return;
        }

        // Format mobile number before sending
        const formattedMobile = formatPhoneNumber(mobile);
        console.log("Formatted Mobile:", formattedMobile);

        // Create user object exactly matching the API schema
        const newUser = {
            id: 0, // This will be assigned by the API
            username,
            password,
            email,
            mobile: formattedMobile, // Use formatted phone number
            is_agent: false,
            disabled: false,
            created_at: new Date().toISOString(),
            password2
        };

        console.log("Submitting user data:", newUser);

        try {
            const res = await fetch('https://netwise-api.onrender.com/api/v1/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser),
            });

            // Log status code
            console.log("Response status:", res.status);

            // Get response as text first
            const responseText = await res.text();
            console.log("Raw API response:", responseText);

            // Try to parse as JSON if possible
            let data;
            try {
                data = JSON.parse(responseText);
                console.log("Parsed response data:", data);
            } catch (e) {
                console.log("Response is not valid JSON");
            }

            if (!res.ok) {
                // Handle validation errors (422)
                if (res.status === 422 && data && data.detail) {
                    const validationErrors = data.detail.map(err =>
                        `Field: ${err.loc.join('.')} - ${err.msg}`
                    ).join('\n');

                    setDetailedError(validationErrors);
                    throw new Error("Validation failed. See details below.");
                }

                // Handle other errors
                throw new Error(data?.detail || data?.message || 'Failed to create user');
            }

            alert('User created successfully');
            navigate('/sign-in');

        } catch (error) {
            console.error('Error signing up:', error);
            setError(error.message || 'Failed to create user');
        }
    };

    return (
        <div className="form-container">
            <h2>Create an account with NestWise</h2>
            {error && (
                <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>
                    {error}
                </div>
            )}
            {detailedError && (
                <div className="detailed-error" style={{ color: 'red', marginBottom: '15px', whiteSpace: 'pre-line', fontSize: '0.9em' }}>
                    {detailedError}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="username"
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label htmlFor="mobile">Mobile</label>
                    <input
                        type="tel"
                        id="mobile"
                        placeholder="Enter your mobile number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                        autoComplete="tel"
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>

                <div>
                    <label htmlFor="password2">Confirm Password</label>
                    <input
                        type="password"
                        id="password2"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>

                <button type="submit">Register</button>
            </form>
            <h4>
                By Registering you accept our <span>Terms of Use</span> and{" "}
                <span>Privacy</span>
            </h4>
            <OAuth />
            <h4>
                Already have an account? <Link to="/sign-in">Sign in here</Link>
            </h4>
        </div>
    );
}

export default SignUp;
