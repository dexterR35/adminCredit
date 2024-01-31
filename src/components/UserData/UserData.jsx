// src/components/UserDataPage/UserDataPage.jsx
import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
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
      const qDesc = collection(db, "oc_data");
      const orderedQuery = query(qDesc, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(orderedQuery);
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
          timestamp: timestamp.toDate(),
        };
      });

      // console.log(data.timestamp, "data");

      setCustomerData(data);
    } catch (error) {
      console.error("Error fetching data from Firestore:", error.message);
    } finally {
      setLoading(false);
    }
  };
  const formatTimestamp = (timestampInMillis) => {
    const timeStampString = new Date(timestampInMillis);
    const formattedTimestamp = timeStampString
      .toLocaleString("ro-RO", {
        day: "numeric",
        month: "long",
        year: "numeric",

        hour12: true,
      })
      .replace("la", "/");
    return formattedTimestamp;
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
              <th>Despre noi</th>
              <th>D.Aplicarii</th>
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
                <td>{formatTimestamp(customer.timestamp)}</td>
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
