import {
  createContext,
  useEffect,
  useReducer,
} from 'react';

import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';

//Creating Context for Auth
export const AuthContext = createContext();

// eslint-disable-next-line react-hooks/rules-of-hooks

//Creating reducer, which will do appropriate stuff, according to the action.type eg. If action.type is equal to LOGIN return the state
// But update the user state, which is in a payload
export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };

    case "LOGOUT":
      return { ...state, user: null };

    case "AUTH_READY":
      return { ...state, user: action.payload, userIsReady: true };

    default:
      return state;
  }
};

//Initializing the authContextProvider, which will wrap all other components of the app
export const AuthContextProvider = ({ children }) => {
  //Initializing the Reducer to work
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    userIsReady: false,
  });

  console.log(state);

  const myAuth = getAuth();

  //After loading of the page, we Automatically enable the user the website content, but doing it only once.
  //And we prevent before loosing the user welcome message when user is logged in etc.
  useEffect(() => {
    const unsub = onAuthStateChanged(myAuth, (user) => {
      dispatch({ type: "AUTH_READY", payload: user });

      unsub();
    });
  }, [myAuth, dispatch]);

  return (
    //Wrapping all children and adding the value of state and dispatch to get it later.
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
