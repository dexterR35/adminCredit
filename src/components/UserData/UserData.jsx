// src/components/UserDataPage/UserDataPage.jsx
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { logout } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie"; // Import useCookies hook

const UserDataPage = () => {
  const [customerData, setCustomerData] = useState([]);
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["idToken"]);
  useEffect(() => {
    if (!cookies.idToken) {
      // If not authenticated, navigate to the login page
      navigate("/login");
    } else {
      // If authenticated, fetch user data
      fetchData();
    }
  }, [cookies.idToken, navigate]);
  const fetchData = async () => {
    const db = getFirestore();

    try {
      const querySnapshot = await getDocs(collection(db, "oc_data"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        customerInfo: doc.data().customer_data.customer_info,
        bankingStatus: doc.data().banking_status,
        status: doc.data().status,
        files: doc.data().customer_data.customer_files,
      }));
      console.log(data);
      setCustomerData(data);
    } catch (error) {
      console.error("Error fetching data from Firestore:", error.message);
    }
  };
  const handleLogout = async () => {
    removeCookie("idToken");
    await logout();
    navigate("/login");
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
              <td>{customer.customerInfo.name}</td>
              <td>{customer.customerInfo.email}</td>
              <td>{customer.customerInfo.phone}</td>
              <td>{customer.customerInfo.selectedDate}</td>
              <td>{customer.customerInfo.aboutUs}</td>
              <td>
                {" "}
                {customer.bankingStatus?.negative
                  ? Object.entries(customer.bankingStatus.negative).map(
                      ([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {value}
                        </div>
                      )
                    )
                  : "N/A"}
              </td>

              <td>{customer.status}</td>
              <td>{customer.files}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserDataPage;
