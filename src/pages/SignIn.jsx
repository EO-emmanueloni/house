import React from 'react'
import { useState } from 'react';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await fetch ('http://localhost:3001/users' )

            const users = await res.json();

            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                alert('Sign in successful');
            } else {
                throw new Error('Invalid email or password');
        }   } catch (error) {
            console.error('Error signing in:', error);
            alert('Failed to sign in');
    }   }
  
  return (
    <div className="form-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        {/* <div>
          <label htmlFor="name">UserName</label>
          <input type="text" placeholder="Enter your name" id="name" />
        </div> */}

        <div>
          <label htmlFor="email">Email</label>
          <input type="text" id="email" placeholder="isioma@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}/>
        </div>

       

        <button type="submit">Sign In</button>
      </form>
      
    </div>
  );
}
    

export default SignIn