import {
  useEffect,
  useReducer,
  useState,
} from 'react';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';

//Initializing the state of an Reducer
let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: false,
};

//Initializing the reducer
const firestoreReducer = (state, action) => {
  switch (action.type) {
    //If it's pending set only pending to true
    case "IS_PENDING":
      return { ...state, isPending: true };

    //Assign payload to the document and true to success
    case "ADDED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };

    //Assign payload to the document and true to success
    case "DELETED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };

    //Assign null to the document, false to success and payload to error
    case "ERROR":
      return {
        ...state,
        error: action.payload,
        success: false,
        isPending: false,
        document: null,
      };

    case "UPDATED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        error: null,
        success: true,
      };

    default:
      return state;
  }
};

//Initializing hook
export const useFirestore = (col) => {
  //Creating Reducer and States
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  const db = getFirestore();

  const ref = collection(db, col);

  //only dispatch if not cancelled

  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  //Adding the document to firestore
  const addDocument = async (document) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const createdAt = Timestamp.fromDate(new Date());
      const addedDocument = await addDoc(ref, { ...document, createdAt });
      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: addedDocument,
      });
    } catch (error) {
      dispatchIfNotCancelled({ type: "ERROR", payload: error.message });
    }
  };

  //Deleting the document
  const deleteDocument = (id) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const deletedDocument = doc(ref, id);
      deleteDoc(deletedDocument);

      console.log(deletedDocument);

      dispatchIfNotCancelled({
        type: "DELETED_DOCUMENT",
        payload: deletedDocument,
      });
    } catch (error) {
      dispatchIfNotCancelled({ type: "ERROR", payload: error.messsage });
    }
  };

  const updateDocument = async (id, updates) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const documentToUpdate = doc(db, col, id);

      await updateDoc(documentToUpdate, updates);
      dispatchIfNotCancelled({
        type: "UPDATED_DOCUMENT",
        payload: documentToUpdate,
      });
      return documentToUpdate;
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
      return null;
    }
  };

  //Setting by default Cancelled to true
  useEffect(() => {
    return () => setIsCancelled(false);
  });

  return { addDocument, deleteDocument, updateDocument, isCancelled, response };
};
