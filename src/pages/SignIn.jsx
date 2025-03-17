import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";

function SignIn() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.user);

    console.log(loading)

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(signInStart());

        try {
            const requestBody = { username, password };
            console.log("Sending login request:", requestBody);

            const res = await fetch("https://netwise-api.onrender.com/api/v1/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Login error response:", data);
                throw new Error(data.message || `Error ${res.status}: Failed to log in`);
            }

            console.log("Login successful:", data);

            if (data.access_token) {
                const minimalUser = {
                    id: username, // Use username as ID for now
                    username: username,
                    name: username, // Fallback display name
                };

                dispatch(signInSuccess(minimalUser));
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("user", JSON.stringify(minimalUser));
                alert("Sign in successful");
                navigate("/");
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            dispatch(signInFailure(error.message));
            alert(error.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {loading && <p>Loading...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                </button>
                <OAuth />
            </form>
        </div>
    );
}

export default SignIn;
