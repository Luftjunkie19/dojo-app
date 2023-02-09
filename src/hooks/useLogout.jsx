import {
  useEffect,
  useState,
} from 'react';

import { getAuth } from 'firebase/auth';
import {
  doc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';

import { useAuthContext } from './useAuthContext';

export function useLogout() {
  //Initializing states and providing a dispatch to change the Reducer state
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    const myAuth = getAuth();

    try {
      //Loging out of the app

      const firestore = getFirestore();
      const user = doc(firestore, "users", myAuth.currentUser.uid);

      await updateDoc(user, { online: false });

      myAuth.signOut();

      //Setting state of Reducer to loged out, whereas the User will be already null
      dispatch({ type: "LOGOUT" });

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

  //Setting the cancelledState to true by default
  useEffect(() => setIsCancelled(false), []);

  return { logout, error, isPending };
}

export default useLogout;
