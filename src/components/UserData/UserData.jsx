// src/components/UserDataPage/UserDataPage.jsx
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { logout } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const UserDataPage = () => {
  const [customerData, setCustomerData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    // Assuming you have already initialized your Firebase app
    const db = getFirestore();

    try {
      const querySnapshot = await getDocs(collection(db, "oc_customers"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCustomerData(data);
    } catch (error) {
      console.error("Error fetching data from Firestore:", error.message);
    }
  };
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div>
      <h2>User Data</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {customerData.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserDataPage;
