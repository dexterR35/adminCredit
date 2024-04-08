import React from 'react'
import { FetchContractData } from "../../services/Hooks";

const ContractPage = () => {
    const { contracts } = FetchContractData();
    return (

        <div>
            <div>
                {contracts.map((contract) => (
                    <div key={contract.id} style={{ marginBottom: "20px" }}>
                        <h2>
                            {contract.firstName} {contract.lastName}
                        </h2>
                        <p>Phone: {contract.phone}</p>
                        <p>Email: {contract.email}</p>
                        {contract.photo && (
                            <img
                                src={contract.photo}
                                alt="Uploaded"
                                style={{ width: "100px", height: "100px" }}
                            />
                        )}
                        {contract.signature && (
                            <img
                                src={contract.signature}
                                alt="Signature"
                                style={{ width: "200px", height: "100px" }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ContractPage
