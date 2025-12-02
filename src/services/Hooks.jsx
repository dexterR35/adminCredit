
import { useState, useEffect, useMemo } from 'react';
import { getFirestore, collection, getDocs, query, orderBy, onSnapshot, setDoc, addDoc, doc, updateDoc, deleteDoc, where, serverTimestamp } from 'firebase/firestore';
import {
  getAuth,
  signOut,
  signInWithPopup, GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { db } from '../firebase/config'
import { toast } from "react-toastify";

const auth = getAuth();
// Function to check if the user is already authenticated

export const checkAuthStatus = (setUser, setLoading) => {
  // Always set up the auth state listener for real-time updates
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    try {
      if (user) {
        // User is signed in - sync with sessionStorage
        sessionStorage.setItem("authUser", JSON.stringify(user));
        setUser(user);
      } else {
        // User is signed out - clear sessionStorage
        sessionStorage.removeItem("authUser");
        setUser(null);
      }
    } catch (error) {
      console.error("Authentication status error:", error.message);
      setUser(null);
      sessionStorage.removeItem("authUser");
    } finally {
      // Set loading to false after auth state is determined
      if (setLoading) {
        setLoading(false);
      }
    }
  });
  
  // Return a cleanup function to unsubscribe when the component unmounts
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

// Function to perform login
export const Login = async (email, password) => {
  try {
    // Attempt to sign in with email and password
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // On successful login, show a success toast
    toast.success("Login successful!");
    return user;

  } catch (error) {
    // Handle different types of Firebase authentication errors
    switch (error.code) {
      case "auth/wrong-password":
        toast.error("Incorrect password. Please try again.");
        break;

      case "auth/user-not-found":
        toast.error("No user found with this email.");
        break;

      case "auth/invalid-email":
        toast.error("Invalid email format.");
        break;

      case "auth/user-disabled":
        toast.error("This account has been disabled.");
        break;

      default:
        toast.error(`Login error: ${error.message}`);
        break;
    }

    // Throw the error for further handling
    throw new Error(`Login error: ${error.message}`);
  }
};

export const Logout = async () => {
  try {
    // Clear sessionStorage before signing out
    sessionStorage.removeItem("authUser");
    await signOut(auth);
    toast.success("Logout successful!");
  } catch (error) {
    // Clear sessionStorage even if signOut fails
    sessionStorage.removeItem("authUser");
    toast.error(`Logout error: ${error.message}`);
    throw new Error(`Logout error: ${error.message}`);
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

/**
 * Lightweight hook for stats only (used in HomePage)
 * Uses getDocs instead of onSnapshot to reduce Firebase reads
 * Fetches once on mount - no refresh interval
 */
export const useCustomersStats = () => {
  const [stats, setStats] = useState({ total: 0, lastCustomerName: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const q = query(collection(db, "oc_data"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const lastCustomer = snapshot.docs[0]?.data();
        
        setStats({
          total: snapshot.size,
          lastCustomerName: lastCustomer?.customer_info?.formData?.name || null,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customer stats:", error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return { ...stats, loading };
};

/**
 * Full customer data hook with real-time updates
 * Used in ClientsWebPage where real-time updates are needed
 * OPTIMIZATION: Limited to 500 records to reduce Firebase reads
 */
export const FetchCustomersData = () => {
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "oc_data"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        name: doc.data().customer_info?.formData?.name || '',
        phone: doc.data().customer_info?.formData?.phone || '',
        ifn: doc.data().customer_info?.banking_info?.ifn || [],
        banks: doc.data().customer_info?.banking_info?.banks || [],
        others: doc.data().customer_info?.banking_info?.others || [],
        bankHistory: doc.data().customer_info?.banking_info?.bankHistory === false ? "No bank history" : "Bank history",
        bankStatus: doc.data().customer_info?.banking_status === false ? "No raport status" : "Negativ Raport",
        selectedDate: doc.data().customer_info?.formData?.selectedDate || '',
        aboutUs: doc.data().customer_info?.formData?.aboutUs || '',
        email: doc.data().customer_info?.formData?.email || '',
        status: doc.data().customer_status || '',
        timestamp: doc.data().timestamp?.seconds ? FormatTimestamp(doc.data().timestamp.seconds * 1000) : new Date().toLocaleString(),
      }));
      setCustomerData(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching customers:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateCustomer = async (id, data) => {
    await updateDoc(doc(db, "oc_data", id), data);
    toast.success("Customer updated!");
  };

  const deleteCustomer = async (id) => {
    await deleteDoc(doc(db, "oc_data", id));
    toast.success("Customer deleted!");
  };

  return { customerData, loading, updateCustomer, deleteCustomer };
};
/**
 * Lightweight hook for contract stats only (used in HomePage)
 * Uses getDocs instead of onSnapshot to reduce Firebase reads
 * Fetches once on mount - no refresh interval
 */
export const useContractsStats = () => {
  const [stats, setStats] = useState({ total: 0, lastContractName: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const q = query(collection(db, 'contracts'), orderBy("timeStamp", "desc"));
        const snapshot = await getDocs(q);
        const first = snapshot.docs[0]?.data();
        
        setStats({
          total: snapshot.size,
          lastContractName: first ? `${first.firstName || ''} ${first.lastName || ''}`.trim() : null,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contract stats:", error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return { ...stats, loading };
};

/**
 * Full contract data hook with real-time updates
 * Used in ContractTable where real-time updates are needed
 * OPTIMIZATION: Limited to 500 records to reduce Firebase reads
 */
export const FetchContractData = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'contracts'), orderBy("timeStamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timeStamp?.seconds 
          ? FormatTimestamp(doc.data().timeStamp.seconds * 1000)
          : new Date().toLocaleString(),
      }));
      setContracts(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching contracts:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onDelete = async (id) => {
    await deleteDoc(doc(db, 'contracts', id));
    toast.success("Contract deleted!");
  };

  return { contracts, loading, onDelete };
};
// Function to add a new consultant

export const AddConsultant = async (email, password, username, role) => {
  try {
    const docRef = await addDoc(collection(db, "consultants"), {
      email: email,
      password: password,
      username: username,
      role: role,
      timestamp: serverTimestamp(),
    });

    // Create user credentials using Firebase Authentication
    await createUserWithEmailAndPassword(auth, email, password);

    // Show success message
    toast.success("Consultant added successfully!");

    // Return success status or any other data as needed
    return { id: docRef.id, email, username, role };
  } catch (error) {
    // Show error message
    toast.error(`Error adding consultant: ${error.message}`);
    throw error;
  }
};

export const getAllConsultants = async () => {
  try {
    // Fetch all documents from the "consultants" collection
    const consultantsCollection = collection(db, 'consultants');
    const querySnapshot = await getDocs(consultantsCollection);

    // Initialize an array to store all documents data
    const consultantsData = [];

    // Iterate through each document in the query snapshot
    querySnapshot.forEach((doc) => {
      // Extract the desired fields from each document and push them to the array
      const consultantData = {
        id: doc.id,
        username: doc.data().username,
        email: doc.data().email
        // Add other desired fields here
      };
      consultantsData.push(consultantData);
    });

    // Return the array of document data
    return consultantsData;
  } catch (error) {
    throw error;
  }
};



export const getConsultantByUserName = async (username) => {
  try {
    // Query the 'consultants' collection for the consultant with the specified username
    const consultantsCollection = collection(db, 'consultants');
    const consultantQuery = query(consultantsCollection, where('username', '==', username));
    const querySnapshot = await getDocs(consultantQuery);
    // If there is a document with the specified username, return its data
    if (!querySnapshot.empty) {
      const consultantData = querySnapshot.docs[0].data();
      return consultantData;
    } else {
      throw new Error("Consultant not found");
    }
  } catch (error) {
    throw error;
  }
};




// Function to add a new report to the 'raport' collection
export const addRaport = async (formData) => {
  try {
    // Add the form data to the Firestore collection 'raport'
    const docRef = await addDoc(collection(db, "raport"), {
      ...formData,
      timestamp: serverTimestamp(),
    });

    // Show success message
    toast.success("Raport added successfully!");

    // Return the document reference or any other data as needed
    return docRef.id;
  } catch (error) {
    // Show error message
    toast.error(`Error adding raport: ${error.message}`);
    throw error;
  }
};

/**
 * Full raport data hook with real-time updates
 * OPTIMIZATION: Limited to 500 records to reduce Firebase reads
 */
export const useFetchRaportNew = () => {
  const [raports, setRaports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'raport'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.seconds 
          ? new Date(doc.data().timestamp.seconds * 1000)
          : new Date(),
      }));
      setRaports(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching raports:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onDelete = async (id) => {
    await deleteDoc(doc(db, 'raport', id));
    toast.success("Report deleted!");
  };

  return { raports, loading, onDelete };
};