import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import mockData from '../..//db.json';

function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(name, email, password);

        const newUser = { name, email, password };


        try {
            mockData.usersData.push(newUser);
            // const res = await fetch('http://localhost:3001/usersData', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(newUser),
            // });

            // if (!res.ok) {
            //     throw new Error('Failed to create user');
            // }
            alert('User created successfully');
            
            
        } catch (error) {
            console.error('Error signing up:', error);
            alert('Failed to create user');
        }
    }
  return (
    <div className="form-container">
      <h2>Create an account with NestWise</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name"
          >Name</label>
          <input type="text" placeholder="Enter your name" id="name"
          value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input type="text" id="email" placeholder="isioma@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
         required />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
        </div>

        {/* <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" />
        </div> */}

        <button type="submit">Register</button>
      </form>
      <h4>
        By Registering you accept our <span>Terms of Use</span> and{" "}
        <span>Privacy</span>
      </h4>

      <h4>
        Already have an account? <Link to="/sign-in">Sign in here</Link>
      </h4> 
    </div>
  );
}

export default SignUp;
