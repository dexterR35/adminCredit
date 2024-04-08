// useFirestoreCollection.js
import { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import app from './config';

const db = getFirestore(app);

const useFirestoreCollection = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = collection(db, collectionName).onSnapshot(snapshot => {
      const newData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(newData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName]);

  const addDocument = async (documentData) => {
    try {
      await addDoc(collection(db, collectionName), documentData);
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const updateDocument = async (documentId, newData) => {
    try {
      await updateDoc(doc(db, `${collectionName}/${documentId}`), newData);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      await deleteDoc(doc(db, `${collectionName}/${documentId}`));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return { data, loading, addDocument, updateDocument, deleteDocument };
};

export default useFirestoreCollection;
