
import { useState, useEffect, useMemo } from 'react';
import { getFirestore, collection, getDocs, query, orderBy, onSnapshot, setDoc, addDoc, doc, updateDoc, deleteDoc, where, serverTimestamp } from 'firebase/firestore';
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
  const [lastAddedCustomer, setLastAddedCustomer] = useState(null);

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
        banks: Array.isArray(customer.customer_info.banking_info.banks) && customer.customer_info.banking_info.banks.length > 0
          ? customer.customer_info.banking_info.banks.map(item => <div key={item}>{item}</div>)
          : <div>OK</div>,
        others: Array.isArray(customer.customer_info.banking_info.others) && customer.customer_info.banking_info.others.length > 0
          ? customer.customer_info.banking_info.others.map(item => <div key={item}>{item}</div>)
          : <div>OK</div>,
        bankHistory: customer.customer_info.banking_info.bankHistory === false
          ? <div className="bg-success p-1 text-gray-50 text-[0.85em] text-center font-bold">No bank history</div>
          : <div className="bg-error p-1 text-gray-50 text-[0.85em] text-center font-bold">Bank history</div>,
        bankStatus: customer.customer_info.banking_info.bankHistory === true
          ? <div className="bg-success p-1 text-gray-50 text-[0.85em] text-center font-bold">No raport status</div>
          : customer.customer_info.banking_status === false
            ? <div className="bg-success p-1 text-gray-50 text-[0.85em] text-center font-bold ">No raport status</div>
            : <div className="bg-error p-1 text-gray-50 text-[0.85em] text-center font-bold">Negativ Raport</div>,
        selectedDate: customer.customer_info.formData.selectedDate
          ? customer.customer_info.formData.selectedDate
          : "not eligible",
        aboutUs: customer.customer_info.formData.aboutUs,
        timestamp: customer.timestamp,
        email: customer.customer_info.formData.email,
        status: customer.customer_status
      }));
      setCustomerData(formattedData);
      // Set last added customer
      if (formattedData.length > 0) {
        setLastAddedCustomer(formattedData[0]);
      }
      console.log(customerData, "hooks")
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


  return { customerData, updateCustomer, deleteCustomer, customersAddedOnCurrentDay, lastAddedCustomer, lengthOfCustomersAddedOnCurrentDay, nameOfLastAddedCustomer };
};
export const FetchContractData = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'contracts'), orderBy("timeStamp", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const contractList = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              timestamp: FormatTimestamp(data.timeStamp.seconds * 1000),
            };
          });
          setContracts(contractList);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching contracts:', error);
      }
    };

    fetchData();

  }, []);

  const onDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'contracts', id));
      setContracts((prevContracts) =>
        prevContracts.filter((contract) => contract.id !== id)
      );
      console.log("7")
      console.log('Contract successfully deleted!', id);
    } catch (error) {
      console.error('Error deleting contract:', error);
    }
  };

  const lastContractName = useMemo(() => {
    return contracts.length > 0 ? `${contracts[0].firstName} ${contracts[0].lastName}` : '';
  }, [contracts]);

  const contractsLength = useMemo(() => contracts.length, [contracts]);
console.log(contractsLength,"ds")
console.log(lastContractName,"ds")
console.log(contracts,"contracts")
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
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'raport'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const raportList = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            console.log(data,"Dasfa");
            return {
              id: doc.id,
              ...data,
              timestamp: data.timestamp ? new Date(data.timestamp.seconds * 1000) : new Date(),
            };
          });
          setRaports(raportList);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching raports:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'raport', id));
      setRaports((prevRaports) => prevRaports.filter((raport) => raport.id !== id));
      console.log('Raport successfully deleted!', id);
    } catch (error) {
      console.error('Error deleting raport:', error);
    }
  };

  const lastRaportInfo = useMemo(
    () => (raports.length > 0 ? `${raports[0].firstName} ${raports[0].lastName} - ${raports[0].timestamp.toLocaleDateString()}` : ''),
    [raports]
  );

  const raportsLength = useMemo(() => raports.length, [raports]);
console.log(raports,"raports")
  return { raports, loading, onDelete, lastRaportInfo, raportsLength };
};