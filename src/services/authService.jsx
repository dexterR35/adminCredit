// src/services/authService.js
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const auth = getAuth();
const auth2 = getAuth();

// Function to check if the user is already authenticated
export const checkAuthStatus = (setUser) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    try {
      if (user) {
        // User is signed in
        setUser(user);
        sessionStorage.setItem("authUser", JSON.stringify(user));
        console.log(auth2.currentUser, "test2");
        console.log(auth2.currentUser.uid, "test2");
      } else {
        setUser(null);
        sessionStorage.removeItem("authUser");
      }
    } catch (error) {
      console.error("Authentication status error:", error.message);
    }
  });

  // Return a cleanup function to unsubscribe when the component unmounts
  return () => unsubscribe();
};

// Function to perform login
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error("Authentication error:", error.message);
    throw new Error(`Authentication error: ${error.message}`);
  }
};

export const logout = async () => {
  try {
    // Sign out the user
    await signOut(auth);

    console.log("Logout successful");
  } catch (error) {
    console.error("Logout error:", error.message);
    throw error; // Re-throw the error to propagate it to the caller, if needed.
  }
};
