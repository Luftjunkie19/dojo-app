//Importing useContext and the Context we would like to use

import { useContext } from 'react';

import { AuthContext } from '../context/AuthContext';

export function useAuthContext() {
  //getting the Context
  const context = useContext(AuthContext);
  console.log(context);

  //If there is no Context show an error
  if (!context) {
    throw Error("useAuthContext must be inside a provider");
  }

  return context;
}
