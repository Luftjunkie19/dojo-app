import {
  useEffect,
  useState,
} from 'react';

import {
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from 'firebase/auth';
import {
  doc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';

import { useAuthContext } from './useAuthContext';

export function useLogin() {
  //Providing states and dispatch to update state wheather the user is logged in or not
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const myAuth = getAuth();

  //Loggin by email
  const logInByGoogle = async () => {
    setError(null);
    setIsPending(true);

    try {
      //Implementing the provider
      const googleProvider = new GoogleAuthProvider();

      //Redirecting to login
      const res = await signInWithRedirect(myAuth, googleProvider);

      const firestore = getFirestore();

      const document = doc(firestore, "users", res.user.uid);

      await updateDoc(document, { online: true });

      //Changing the state of reducer
      dispatch({ type: "LOGIN", payload: res.user });

      //When the Cancelled state wil be false set loading to off and Error to null
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      //When the Cancelled state wil be false set loading to off and Error to message
      if (!isCancelled) {
        console.log(err.message);
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  const logInByFacebook = async () => {
    try {
      const facebookProvider = new FacebookAuthProvider();
      const res = await signInWithRedirect(myAuth, facebookProvider);

      console.log(res);

      const firestore = getFirestore();

      const document = doc(firestore, "users", res.user.uid);

      await updateDoc(document, { online: true });

      dispatch({ type: "LOGIN", payload: res.user });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (error) {
      if (!isCancelled) {
        console.log(error.message);
        setError(error.message);
        setIsPending(false);
      }
    }
  };

  //Implementing login by normal providing 2 parameters
  const login = async (email, password) => {
    setError(null);
    setIsPending(true);

    try {
      //Signing in the user by Password and Email
      const res = await signInWithEmailAndPassword(myAuth, email, password);

      const firestore = getFirestore();

      const document = doc(firestore, "users", res.user.uid);

      await updateDoc(document, { online: true });

      //Changing the state to the gotten user.
      dispatch({ type: "LOGIN", payload: res.user });

      //When the Cancelled state wil be false set loading to off and Error to null
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      //When the Cancelled state wil be false set loading to off and Error to message
      if (!isCancelled) {
        console.log(err.message);
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  //Setting setIsCancelled by default
  useEffect(() => setIsCancelled(false), []);

  //returning the stuff that will be needed
  return { login, error, isPending, logInByGoogle, myAuth, logInByFacebook };
}

export default useLogin;
