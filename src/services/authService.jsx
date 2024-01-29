// src/services/authService.js
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

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
    return userCredential.user;
  } catch (error) {
    console.error("Authentication error:", error.message);
    throw new Error(`Authentication error: ${error.message}`);
  }
};

export const Logout = async () => {
  try {
    // Sign out the user
    await signOut(auth);
    sessionStorage.clear();
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout error:", error.message);
    throw error; // Re-throw the error to propagate it to the caller, if needed.
  }
};
