import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loginpage.css'; 

const Loginpage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = () => {
    // Dummy validation - Replace this with actual validation logic
    if (username === 'admin' && password === 'password') {
      // Clear any previous errors
      setError('');

      // Redirect to homepage
      navigate('/home');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <h2 style={{textAlign:'center'}}>Login</h2>

        <div className="input-group">
          <label>
            Username:
            <input
              className="input-field"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </div>

        <div className="input-group">
          <label>
            Password:
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Loginpage;
