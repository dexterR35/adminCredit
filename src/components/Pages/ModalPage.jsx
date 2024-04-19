import React, { useState } from "react";
import Modal from "react-modal";
import ImageViewer from "react-simple-image-viewer";

const CustomModal = ({
    isOpen,
    onRequestClose,
    contentLabel,
    children,
    data,
}) => {
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    console.log(data, "d");
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={contentLabel}
            className="bg-white rounded-lg shadow-lg overflow-auto w-3/4 md:w-2/3 lg:w-2/6 h-96 mx-auto flex flex-col justify-between p-6 items-end"
            overlayClassName="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center"
        >
            {children}
            {data && (
                <div className="flex flex-col space-y-4 w-full items-start justify-top">
                    <div className="text-2xl font-bold text-gray-800">
                        Detalii Client<span className="text-[15px] text-gray-400"> / {data.id}</span>
                    </div>
                    <hr className="bg-gray-400 w-full" />
                    <div className="flex flex-col space-y-2">
                        <p className="capitalize">
                            Nume: {data.firstName} {data.lastName}
                        </p>
                        <p>Phone: {data.phone}</p>
                        <p>Email: {data.email}</p>
                        {data.signature && (
                            <p>
                                Document semnat:{" "}
                                {data.signature ? "Check" : "Nu este Semnat documentul"}
                            </p>
                        )}
                    </div>
                    <hr className="bg-gray-400 w-full" />
                    <div className="flex flex-row space-x-4">
                        {data.photo && (
                            <p
                                className="cursor-pointer underline bg-gray-200 p-2 radius-md"
                                onClick={() => setIsViewerOpen(true)}
                            >
                                View Photo
                            </p>
                        )}
                        {isViewerOpen && (
                            <ImageViewer
                                src={[data.photo]}
                                currentIndex={0}
                                onClose={() => setIsViewerOpen(false)}
                                disableScroll={false}
                                backgroundStyle={{
                                    backgroundColor: "rgba(0,0,0,0.9)",
                                }}
                                closeOnClickOutside={true}
                            />
                        )}

                        {data.pdfUrl && (
                            <a
                                href={data.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cursor-pointer underline bg-gray-200 p-2 radius-md"
                            >
                                View PDF
                            </a>
                        )}
                    </div>
                </div>
            )}
            <button onClick={onRequestClose} className="bg-red-500 w-fit text-white">
                Close
            </button>
        </Modal>
    );
};

export default CustomModal;
