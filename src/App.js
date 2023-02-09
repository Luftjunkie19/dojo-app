import './App.css';

import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import Navbar from './component/Navbar';
import OnlineUsers from './component/OnlineUsers';
import Sidebar from './component/Sidebar';
import { useAuthContext } from './hooks/useAuthContext';
import Create from './pages/Create';
import Home from './pages/Home';
import Login from './pages/Login';
import Project from './pages/Project';
import SignUp from './pages/SignUp';

function App() {
  const { user, userIsReady } = useAuthContext();

  return (
    <div className="App">
      {userIsReady && (
        <BrowserRouter>
          {user && <Sidebar />}
          <div className="container">
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={(user && <Home />) || (!user && <SignUp />)}
              />
              <Route
                path="/sign-up"
                element={(user && <Home />) || (!user && <SignUp />)}
              />
              <Route
                path="/login"
                element={(user && <Home />) || (!user && <Login />)}
              />
              <Route
                path="/projects/:id"
                element={(user && <Project />) || (!user && <Login />)}
              />
              <Route
                path="/create"
                element={(user && <Create />) || (!user && <Login />)}
              />
            </Routes>
          </div>
          {user && <OnlineUsers />}
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
