// src/services/firestoreService.js
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firestore = getFirestore();
const customersCollection = collection(firestore, "oc_customers");

export const fetchCustomerData = async () => {
  try {
    const querySnapshot = await getDocs(customersCollection);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    throw new Error(`Firestore error: ${error.message}`);
  }
};
