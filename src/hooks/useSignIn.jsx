import {
  useEffect,
  useState,
} from 'react';

import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

import { useAuthContext } from '../hooks/useAuthContext';

function useSignIn() {
  //Initializing some states and getting dispatch from the AuthContext, to change the state of Reducer
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();
  //Cancel state checks if the signing up or any other action has been interrupted by something.
  const [isCancelled, setIsCancelled] = useState(false);

  const myAuth = getAuth();

  //Function to sign in creating an account for new User providing 3 parameters
  const signIn = async (email, password, displayName, profileImg) => {
    //Getting the Auth state and setting Error state to null and Loading to true
    setError(null);
    setIsPending(true);

    try {
      //Creating new User

      const res = await createUserWithEmailAndPassword(myAuth, email, password);

      //If something missed, the Error will appear
      if (!res) {
        throw new Error("could not complete signup");
      }

      const storage = getStorage();

      const uploadPath = `thumbnail/uid${res.user.uid}/${profileImg.name}`;

      const img = ref(storage, uploadPath);

      const snapshot = await uploadBytes(img, profileImg);
      const photoURL = await getDownloadURL(img);

      //Setting the displayName to the Parameter
      await updateProfile(res.user, { displayName, photoURL });

      const firestore = getFirestore();

      const document = doc(firestore, "users", res.user.uid);

      await setDoc(document, { online: true, displayName, photoURL });

      //Changing reducer state to Login and adding User to data
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

  //Set at the first time Cancelled to true
  useEffect(() => setIsCancelled(false), []);

  //Return values to another Components
  return { error, isPending, signIn };
}

export default useSignIn;
