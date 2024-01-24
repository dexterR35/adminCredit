// src/components/UserDataPage/UserDataPage.jsx
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { logout } from "../../services/authService";
import Loader from "../../components/LoadingPage";
const UserDataPage = () => {
  const [customerData, setCustomerData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    console.log("Fetching data...");
    fetchData();
  }, []);
  const fetchData = async () => {
    const db = getFirestore();
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "oc_data"));
      const data = querySnapshot.docs.map((doc) => {
        const { customer_status, customer_info } = doc.data();

        // Function to recursively map nested objects and arrays
        const mapNestedData = (data) => {
          console.log(data, "test");
          if (Array.isArray(data)) {
            return data.map((item) => mapNestedData(item));
          } else if (typeof data === "object" && data !== null) {
            return Object.keys(data).reduce((acc, key) => {
              acc[key] = mapNestedData(data[key]);
              return acc;
            }, {});
          } else {
            return data;
          }
        };

        const mappedCustomerInfo = mapNestedData(customer_info);

        return {
          id: doc.id,
          customer_status: customer_status,
          customer_info: mappedCustomerInfo,
        };
      });

      console.log(data, "data");

      setCustomerData(data);
    } catch (error) {
      console.error("Error fetching data from Firestore:", error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <h2>User Data</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>phone</th>
              <th>jobDate</th>
              <th>BANKS</th>
              <th>IFN</th>
              <th>OTHERS</th>
              <th>bank History</th>
              <th>aboutUs</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {customerData.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.customer_info.formData.name}</td>
                <td>{customer.customer_info.formData.phone}</td>
                <td>{customer.customer_info.formData.selectedDate}</td>
                <td>
                  {Array.isArray(customer.customer_info.banking_info.ifn) &&
                  customer.customer_info.banking_info.ifn.length > 0 ? (
                    customer.customer_info.banking_info.ifn.map(
                      (item, index) => <span key={index}>{item}</span>
                    )
                  ) : (
                    <span>OK</span>
                  )}
                </td>
                <td>
                  {Array.isArray(customer.customer_info.banking_info.ifn) &&
                  customer.customer_info.banking_info.ifn.length > 0 ? (
                    customer.customer_info.banking_info.ifn.map(
                      (item, index) => <span key={index}>{item}</span>
                    )
                  ) : (
                    <span>OK</span>
                  )}
                </td>
                <td>
                  {Array.isArray(customer.customer_info.banking_info.others) &&
                  customer.customer_info.banking_info.others.length > 0 ? (
                    customer.customer_info.banking_info.others.map(
                      (item, index) => <span key={index}>{item}</span>
                    )
                  ) : (
                    <span>OK</span>
                  )}
                </td>
                <td>
                  {customer.customer_info.banking_info.bankHistory ? (
                    <span>Not Ok</span>
                  ) : (
                    <span>Ok</span>
                  )}
                </td>
                <td>{customer.customer_info.formData.aboutUs}</td>
                <td>{customer.customer_info.formData.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
};

export default UserDataPage;
