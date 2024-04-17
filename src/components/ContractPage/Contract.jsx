import React from 'react'
import useCollection from "../../services/firestoreCrud"
const Contract = () => {

    const { data, loading, addDocument, updateDocument, deleteDocument } = useCollection({
        collectionName: 'contract',
        options: { /* opțiuni suplimentare, cum ar fi filtre sau sortare */ }
    });

    return (
        <div>

        </div>
    )
}

export default Contract
