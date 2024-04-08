

import { FetchCustomersData, FormatTimestamp } from "../../services/Hooks";

const UserDataPage = () => {
  const { customerData } = FetchCustomersData();
  return (
    <>

      <h2>Clienti ObtineCredit</h2>
      {/* <button onClick={fetchCustomers} className="btn-fetch-data">Fetch Data</button> */}
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
                <td>{FormatTimestamp(customer.timestamp)}</td>
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
