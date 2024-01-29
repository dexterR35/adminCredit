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
        const { customer_status, customer_info, timestamp } = doc.data();

        // Function to recursively map nested objects and arrays
        const mapNestedData = (data) => {
          // console.log(data, "test");
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
          timestamp: timestamp.toMillis(),
        };
      });
      data.sort((a, b) => {
        const dateA = new Date(a.formattedDate);
        const dateB = new Date(b.formattedDate);
        console.log("dateA:", dateA, "dateB:", dateB);
        return dateA - dateB;
      });
      console.log(data.timestamp, "data");

      setCustomerData(data);
    } catch (error) {
      console.error("Error fetching data from Firestore:", error.message);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <>
      {isLoading && <Loader />}
      <HeaderUser />
      <h2>Clienti ObtineCredit</h2>
      <div className="container p-2 h-[60vh] overflow-scroll mx-auto">
        <table className="w-full">
          <thead>
            <tr className="sticky top-[-10px]">
              <th>Nume</th>
              <th>Telefon</th>
              <th>Banci</th>
              <th>Ifn</th>
              <th>Diverse</th>
              <th>Istoric Bancar</th>
              <th>D.angajarii</th>
              <th>aboutUs</th>
              <th>JoinDate</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {customerData.map((customer) => (
              <tr key={customer.id}>
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
                    <div className="bg-green-300 w-full h-full">
                      Nu are Istoric
                    </div>
                  ) : (
                    <div className="bg-red-300 w-full h-full">Are Istoric</div>
                  )}
                </td>
                <td>
                  {customer.customer_info.formData.selectedDate
                    ? customer.customer_info.formData.selectedDate
                    : "Nu are"}
                </td>
                <td>{customer.customer_info.formData.aboutUs}</td>
                <td>{formatDate(customer.timestamp)}</td>
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
