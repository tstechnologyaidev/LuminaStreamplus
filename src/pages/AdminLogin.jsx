import { useState } from 'react';
import './AdminLogin.css';

const ADMIN_USERNAME = 'PvPFury';
const ADMIN_PASSWORD = 'Noomi Lallier';

function AdminLogin({ onSuccess, onCancel }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setError('');
      onSuccess();
      return;
    }

    setError('Invalid username or password.');
  };

  return (
    <div className="maintenance-page">
      <div className="maintenance-panel">
        <h1>Admin Login Required</h1>
        <p>Please enter your admin credentials to bypass maintenance mode.</p>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error && <p className="admin-login-error">{error}</p>}
          <div className="admin-login-actions">
            <button type="submit" className="maintenance-btn admin-btn">
              Login
            </button>
            <button type="button" className="maintenance-btn admin-cancel" onClick={onCancel}>
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
