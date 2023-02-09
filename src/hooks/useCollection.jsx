import {
  useEffect,
  useRef,
  useState,
} from 'react';

//Providing essentials of firestore
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

//Initializing the component that takes 3 parameters
export const useCollection = (col, _query, _orderBy) => {
  //Setting states of documents and error
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  //Creating the Reference to query and orderedBy etc.
  let quer = useRef(_query).current;

  let orderedBy = useRef(_orderBy).current;

  console.log(quer);

  const db = getFirestore();

  //Background effects fullfilling the conditions
  useEffect(() => {
    let ref = collection(db, col);

    if (quer) {
      ref = query(ref, where(...quer));
    }

    if (orderedBy) {
      ref = query(ref, orderBy(...orderedBy));
    }

    //Getting the state on the collection elements even after some events
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((snap) => {
          results.push({ ...snap.data(), id: snap.id });
        });
        //Setting the results meaning the data elements to documents and setting error to null
        setDocuments(results);
        setError(null);
      },
      (error) => {
        //If something occurs wrong send the error
        setError(error.message);
      }
    );

    //do it ONES
    return () => unsubscribe();
  }, [db, col, orderedBy, quer]);

  return { documents, error };
};
