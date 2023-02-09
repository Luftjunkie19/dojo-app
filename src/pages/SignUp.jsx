import './SignUp.css';

import { useState } from 'react';

import useSignIn from '../hooks/useSignIn';

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [profileImgError, setProfileImgError] = useState("");
  const { signIn, isPending, error } = useSignIn();

  const handleSubmit = (e) => {
    e.preventDefault();

    signIn(email, password, displayName, profileImg);
  };

  const selectProfileImg = (e) => {
    setProfileImg(null);

    let selected = e.target.files[0];

    if (!selected.type.includes("image")) {
      setProfileImgError("Please select an appropriate type of data");
      return;
    }

    if (!selected) {
      setProfileImgError("Please choose any image");
      return;
    }

    if (selected.size > 100000) {
      setProfileImgError("Image file size is too big!");
      return;
    }

    setProfileImgError(null);
    setProfileImg(selected);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Sign up</h2>

      <label>
        <span>Nickname:</span>
        <input
          type="text"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </label>

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

      <label>
        <span>Profile Picture:</span>
        <input type="file" required onChange={selectProfileImg} />
        {profileImgError && <div className="error">{profileImgError}</div>}
      </label>

      {isPending && (
        <button className="btn" disabled>
          Loading...
        </button>
      )}

      {!isPending && <button className="btn">Sign Up</button>}

      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default SignUp;
