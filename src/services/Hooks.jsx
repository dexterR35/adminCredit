
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

export const checkAuthStatus = (setUser) => {
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

export const FetchCustomersData = () => {
  const [customerData, setCustomerData] = useState([]);
  const [lastAddedCustomer, setLastAddedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    
    try {
      const q = query(collection(db, "oc_data"), orderBy("timestamp", "desc"));
      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          try {
            const data = querySnapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id,
              timestamp: doc.data().timestamp?.seconds 
                ? FormatTimestamp(doc.data().timestamp.seconds * 1000)
                : new Date().toLocaleString(),
            }));
            
            const formattedData = data.map(customer => ({
              id: customer.id,
              name: customer.customer_info?.formData?.name || '',
              phone: customer.customer_info?.formData?.phone || '',
              ifn: Array.isArray(customer.customer_info?.banking_info?.ifn) && customer.customer_info.banking_info.ifn.length > 0
                ? customer.customer_info.banking_info.ifn.map(item => <div key={item}>{item}</div>)
                : <div>OK</div>,
              banks: Array.isArray(customer.customer_info?.banking_info?.banks) && customer.customer_info.banking_info.banks.length > 0
                ? customer.customer_info.banking_info.banks.map(item => <div key={item}>{item}</div>)
                : <div>OK</div>,
              others: Array.isArray(customer.customer_info?.banking_info?.others) && customer.customer_info.banking_info.others.length > 0
                ? customer.customer_info.banking_info.others.map(item => <div key={item}>{item}</div>)
                : <div>OK</div>,
              bankHistory: customer.customer_info?.banking_info?.bankHistory === false
                ? "No bank history"
                : "Bank history",
              bankStatus: customer.customer_info?.banking_info?.bankHistory === true
                ? "No raport status"
                : customer.customer_info?.banking_status === false
                  ? "No raport status"
                  : "Negativ Raport",
              selectedDate: customer.customer_info?.formData?.selectedDate || "not eligible",
              aboutUs: customer.customer_info?.formData?.aboutUs || '',
              timestamp: customer.timestamp,
              email: customer.customer_info?.formData?.email || '',
              status: customer.customer_status || ''
            }));
            
            setCustomerData(formattedData);
            if (formattedData.length > 0) {
              setLastAddedCustomer(formattedData[0]);
            }
            setLoading(false);
          } catch (error) {
            console.error("Error processing customer data:", error);
            setLoading(false);
          }
        },
        (error) => {
          console.error("Snapshot error for customers:", error);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("Error setting up customer snapshot:", error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const updateCustomer = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, "oc_data", id), updatedData);
      toast.success("Customer updated successfully!");
      // Snapshot will automatically update the state, no manual update needed
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error(`Error updating customer: ${error.message}`);
      throw error;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await deleteDoc(doc(db, "oc_data", id));
      toast.success("Customer deleted successfully!");
      // Snapshot will automatically update the state, no manual update needed
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error(`Error deleting customer: ${error.message}`);
      throw error;
    }
  };

  const customersAddedOnCurrentDay = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return customerData.filter(customer => {
      const customerDate = new Date(customer.timestamp);
      customerDate.setHours(0, 0, 0, 0);
      return customerDate.getTime() === today.getTime();
    });
  }, [customerData]);

  const lengthOfCustomersAddedOnCurrentDay = customersAddedOnCurrentDay.length;
  const nameOfLastAddedCustomer = customersAddedOnCurrentDay.length > 0 ? customersAddedOnCurrentDay[0].name : null;


  return { 
    customerData, 
    loading,
    updateCustomer, 
    deleteCustomer, 
    customersAddedOnCurrentDay, 
    lastAddedCustomer, 
    lengthOfCustomersAddedOnCurrentDay, 
    nameOfLastAddedCustomer 
  };
};
export const FetchContractData = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    
    try {
      const q = query(collection(db, 'contracts'), orderBy("timeStamp", "desc"));
      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          try {
            const contractList = querySnapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                timestamp: data.timeStamp?.seconds 
                  ? FormatTimestamp(data.timeStamp.seconds * 1000)
                  : new Date().toLocaleString(),
              };
            });
            setContracts(contractList);
            setLoading(false);
          } catch (error) {
            console.error('Error processing contract data:', error);
            setLoading(false);
          }
        },
        (error) => {
          console.error('Snapshot error for contracts:', error);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Error setting up contract snapshot:', error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const onDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'contracts', id));
      toast.success("Contract deleted successfully!");
      // Snapshot will automatically update the state, no manual update needed
    } catch (error) {
      console.error('Error deleting contract:', error);
      toast.error(`Error deleting contract: ${error.message}`);
      throw error;
    }
  };

  const lastContractName = useMemo(() => {
    return contracts.length > 0 ? `${contracts[0].firstName || ''} ${contracts[0].lastName || ''}`.trim() : '';
  }, [contracts]);

  const contractsLength = useMemo(() => contracts.length, [contracts]);

  return { contracts, loading, onDelete, lastContractName, contractsLength };
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

export const useFetchRaportNew = () => {
  const [raports, setRaports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    
    try {
      const q = query(collection(db, 'raport'), orderBy('timestamp', 'desc'));
      unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          try {
            const raportList = querySnapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                timestamp: data.timestamp?.seconds 
                  ? new Date(data.timestamp.seconds * 1000)
                  : new Date(),
              };
            });
            setRaports(raportList);
            setLoading(false);
          } catch (error) {
            console.error('Error processing raport data:', error);
            setLoading(false);
          }
        },
        (error) => {
          console.error('Snapshot error for raports:', error);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Error setting up raport snapshot:', error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const onDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'raport', id));
      toast.success("Report deleted successfully!");
      // Snapshot will automatically update the state, no manual update needed
    } catch (error) {
      console.error('Error deleting raport:', error);
      toast.error(`Error deleting report: ${error.message}`);
      throw error;
    }
  };

  const lastRaportInfo = useMemo(
    () => (raports.length > 0 
      ? `${raports[0].firstName || ''} ${raports[0].lastName || ''} - ${raports[0].timestamp?.toLocaleDateString() || ''}`.trim()
      : ''),
    [raports]
  );

  const raportsLength = useMemo(() => raports.length, [raports]);

  return { raports, loading, onDelete, lastRaportInfo, raportsLength };
};