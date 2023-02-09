import './Navbar.css';

import { Link } from 'react-router-dom';

import Temple from '../assets/temple.svg';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLogout } from '../hooks/useLogout';

function Navbar() {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();

  return (
    <>
      <div className="navbar">
        <ul>
          <li className="logo">
            <img src={Temple} alt="dojo-logo" />
            <span>The Dojo</span>
          </li>

          {!user && (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/sign-up"> Sign up</Link>
              </li>
            </>
          )}

          {user && (
            <>
              <li>
                {isPending && (
                  <button className="btn" disabled>
                    Loading...
                  </button>
                )}

                {!isPending && (
                  <button className="btn" onClick={logout}>
                    Log out
                  </button>
                )}
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default Navbar;
