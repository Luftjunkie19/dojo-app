import './SignUp.css';

import { useState } from 'react';

import { useLogin } from '../hooks/useLogin';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isPending, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();

    login(email, password);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Log in</h2>

      <label>
        <span>Email:</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label>
        <span>Password:</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {!isPending && <button className="btn">Log in</button>}

      {isPending && (
        <button className="btn" disabled>
          Loading
        </button>
      )}

      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default Login;
