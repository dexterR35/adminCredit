// src/components/UserDataPage/UserDataPage.jsx
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import HeaderUser from "../../components/UserData/HeaderUser";
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

  return (
    <>
      {isLoading && <Loader />}
      <HeaderUser />
      <div className="container border border-red-400 p-2 h-full mx-auto">
        <h2>User Data</h2>
        <table className="w-full border border-collapse border-spacing-2">
          <thead className="rounded-md bg-red-200">
            <tr>
              <th>Nume</th>
              <th>Telefon</th>

              <th>BANKS</th>
              <th>IFN</th>
              <th>OTHERS</th>
              <th>Istoric Bancar</th>
              <th>jobDate</th>
              <th>aboutUs</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {customerData.map((customer) => (
              <tr
                key={customer.id}
                className="p-2 cursor-pointer hover:bg-red-500 hover:text-white transition-colors"
              >
                <td>{customer.customer_info.formData.name}</td>
                <td>{customer.customer_info.formData.phone}</td>

                <td>
                  {Array.isArray(customer.customer_info.banking_info.ifn) &&
                  customer.customer_info.banking_info.ifn.length > 0 ? (
                    customer.customer_info.banking_info.ifn.map(
                      (item, index) => <div key={index}>{item}</div>
                    )
                  ) : (
                    <div>OK</div>
                  )}
                </td>
                <td>
                  {Array.isArray(customer.customer_info.banking_info.ifn) &&
                  customer.customer_info.banking_info.ifn.length > 0 ? (
                    customer.customer_info.banking_info.ifn.map(
                      (item, index) => <div key={index}>{item}</div>
                    )
                  ) : (
                    <div>OK</div>
                  )}
                </td>
                <td>
                  {Array.isArray(customer.customer_info.banking_info.others) &&
                  customer.customer_info.banking_info.others.length > 0 ? (
                    customer.customer_info.banking_info.others.map(
                      (item, index) => <div key={index}>{item}</div>
                    )
                  ) : (
                    <div>OK</div>
                  )}
                </td>

                <td>
                  {customer.customer_info.banking_info.bankHistory === false ? (
                    <div className="bg-green-300 w-full h-full">Nu are</div>
                  ) : (
                    <div className="bg-red-300 w-full h-full">Active</div>
                  )}
                </td>
                <td>
                  {customer.customer_info.formData.selectedDate
                    ? customer.customer_info.formData.selectedDate
                    : "Nu are"}
                </td>
                <td>{customer.customer_info.formData.aboutUs}</td>
                <td>{customer.customer_info.formData.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserDataPage;
