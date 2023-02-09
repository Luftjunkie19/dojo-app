import {
  useEffect,
  useState,
} from 'react';

import {
  doc,
  getFirestore,
  onSnapshot,
} from 'firebase/firestore';

function useDocument(col, id) {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const firestore = getFirestore();
    const ref = doc(firestore, "projects", id);

    const unsub = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.data()) {
          setDocument({ ...snapshot.data(), id: snapshot.id });
          setError(null);
        } else {
          setError("no such document exists");
        }
      },
      (err) => {
        console.log(err.message);
        setError("Failed to get document");
      }
    );

    return () => {
      unsub();
    };
  }, [col, id]);

  return { document, error };
}

export default useDocument;
