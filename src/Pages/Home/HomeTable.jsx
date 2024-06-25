import DynamicTable from "../../Components/Table/DynimicTable";
import { useFetchRaportNew } from "../../services/Hooks";

const NewRaportTable = () => {
    const { raports, loading, onDelete } = useFetchRaportNew();
    const columns = [
        {
            accessorKey: "firstName", 
            header: "Name",
           
            Cell: ({ row }) => <span style={{ textTransform: 'capitalize' }}>{`${row.original.firstName} ${row.original.lastName}`}</span>,
        },
        {
            accessorKey: "todayDate",
            header: "date",
          
        },
        {
            accessorKey: "phone",
            header: "phone",
        },
        {
            accessorKey: "userCNP",
            header: "CNP",
        }
    ];

    const actions = [
        {
            label: "Edit",
            onClick: (client) => {
                console.log("Edit client:", client.id);
                // onDelete(client.id);
            },
        },
        {
            label: "Delete",
            onClick: (client) => {
                console.log("Deleting client:", client.id);
                onDelete(client.id);
            },
        },
        {
            label: "send to Consultant",
            onClick: (client) => {
                console.log("Contacting:", client.name);
                // handleContactClients(client);
            },
        },
        {
            label: "Contact",
            onClick: (client) => {
                console.log("Contacting:", client.name);
                handleContactClients(client);
            },
        },
    
        
    ];
    const handleContactClients = (client) => {
        alert(`Contacting ${client.name} at ${client.phone}`);
        window.open(`tel:${client.phone}`);
      };
    return (
        <>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <DynamicTable
                    columns={columns}
                    data={raports}
                    onDelete={onDelete}
                    actions={actions}
                    title="Raport Clients"
                    linkTable="test"
                    deleteDialogTitle="Confirm Delete"
                    deleteDialogContent="Are you sure you want to delete"
                    handleContact={handleContactClients}
                />
            )}
        </>
    );
};

export default NewRaportTable;
