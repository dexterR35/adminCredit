// src/components/UserDataPage/UserDataPage.jsx
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { logout } from "../../services/authService";

const UserDataPage = () => {
  const [customerData, setCustomerData] = useState([]);
  // const [cookies, removeCookie] = useCookies(["idToken"]);
  useEffect(() => {
    console.log("Fetching data...");
    fetchData();
  }, []);
  const fetchData = async () => {
    const db = getFirestore();
    try {
      const querySnapshot = await getDocs(collection(db, "oc_data"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        customerInfo: doc.data().formData,
      }));
      console.log(data, "data");
      // setCustomerData(data);
    } catch (error) {
      console.error("Error fetching data from Firestore:", error.message);
    }
  };
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      <h2>User Data</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>phone</th>
            <th>jobDate</th>
            <th>aboutUs</th>
            <th>bankHistory</th>
            <th>status</th>
            <th>files</th>
          </tr>
        </thead>
        <tbody>
          {customerData.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.customerInfo}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserDataPage;
