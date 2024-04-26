
import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { db } from '../firebase/config'
import { toast } from "react-toastify";


const auth = getAuth();
// Function to check if the user is already authenticated

export const checkAuthStatus = (setUser) => {
  const authUserString = sessionStorage.getItem("authUser");
  if (authUserString) {
    // If user data is present in sessionStorage, parse and set the user
    const authUser = JSON.parse(authUserString);
    setUser(authUser);
    return; // Exit early, no need to proceed with onAuthStateChanged
  }

  // If no user data in sessionStorage, proceed with the auth state change listener
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    try {
      if (user) {
        // User is signed in
        setUser(user);
        console.log(auth.currentUser, "auth.currentUser");
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Authentication status error:", error.message);
    }
  });
  // Return a cleanup function to unsubscribe when the component unmounts
  return () => unsubscribe();
};

// Function to perform login
export const Login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    toast.success("Login successful!");
    return userCredential.user;
  } catch (error) {
    if (
      error.code === "auth/invalid-email" ||
      error.code === "auth/user-not-found"
    ) {
      // Show specific notification for invalid credentials
      toast.error("Invalid credentials. Please try again.");
    } else {
      // Show general error notification for other types of authentication errors
      toast.error(`Authentication error: ${error.message}`);
    }
    throw new Error(`Authentication error: ${error.message}`);
  }
};


export const Logout = async () => {
  try {
    // Sign out the user
    await signOut(auth);
    sessionStorage.clear();
    console.log("Logout successful");
    toast.succes("Logout successful!");
  } catch (error) {
    console.error("Logout error:", error.message);
    toast.error(`Logout error: ${error.message}`);
    throw error; // Re-throw the error to propagate it to the caller, if needed.
  }
};

export const FormatTimestamp = (timestampInMillis) => {
  const timeStampString = new Date(timestampInMillis);
  const formattedTimestamp = timeStampString
    .toLocaleString("ro-RO", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour12: true,
    })
  return formattedTimestamp;
};

export const FetchCustomersData = () => {
  const [customerData, setCustomerData] = useState([]);
  console.log(customerData, "hooks")
  useEffect(() => {
    const q = query(collection(db, "oc_data"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        timestamp: FormatTimestamp(doc.data().timestamp.seconds * 1000),
      }));
      const formattedData = data.map(customer => ({
        id: customer.id,
        name: customer.customer_info.formData.name,
        phone: customer.customer_info.formData.phone,
        ifn: Array.isArray(customer.customer_info.banking_info.ifn) && customer.customer_info.banking_info.ifn.length > 0
          ? customer.customer_info.banking_info.ifn.map(item => <div key={item}>{item}</div>)
          : <div>OK</div>,
        others: Array.isArray(customer.customer_info.banking_info.others) && customer.customer_info.banking_info.others.length > 0
          ? customer.customer_info.banking_info.others.map(item => <div key={item}>{item}</div>)
          : <div>OK</div>,
        bankHistory: customer.customer_info.banking_info.bankHistory === false
          ? <div className="bg-green-300 w-full h-full">Nu are Istoric</div>
          : <div className="bg-red-300 w-full h-full">Are Istoric</div>,
        selectedDate: customer.customer_info.formData.selectedDate
          ? customer.customer_info.formData.selectedDate
          : "Nu are",
        aboutUs: customer.customer_info.formData.aboutUs,
        timestamp: customer.timestamp,
        email: customer.customer_info.formData.email,
        status: customer.customer_status
      }));
      setCustomerData(formattedData);
    });
    return () => unsubscribe();
  }, []);

  const updateCustomer = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, "oc_data", id), updatedData);
      console.log("Document successfully updated!", id);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await deleteDoc(doc(db, "oc_data", id));
      console.log("Document successfully deleted!", id);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };


  return { customerData, updateCustomer, deleteCustomer };
};


export const FetchContractData = () => {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const q = query(collection(db, 'contracts'), orderBy("timeStamp", "desc"));
        const contractSnapshot = await getDocs(q);
        const contractList = contractSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: FormatTimestamp(data.timeStamp.seconds * 1000),
          };
        });
        setContracts(contractList);
      } catch (error) {
        console.error('Error fetching contracts:', error);
      }
    };

    fetchContracts();
  }, []);

  const onEdit = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, 'contracts', id), updatedData);
      setContracts((prevContracts) =>
        prevContracts.map((contract) =>
          contract.id === id ? { ...contract, ...updatedData } : contract
        )
      );
      console.log('Contract successfully updated!', id);
    } catch (error) {
      console.error('Error updating contract:', error);
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'contracts', id));
      setContracts((prevContracts) =>
        prevContracts.filter((contract) => contract.id !== id)
      );
      console.log('Contract successfully deleted!', id);
    } catch (error) {
      console.error('Error deleting contract:', error);
    }
  };

  return { contracts, onEdit, onDelete };
};
