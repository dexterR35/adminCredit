import React from 'react';
import SwitchLang from "../SwitchLang";
import { useModal, Modal } from "../../Modal/useModal";
import CreateConsultant from "../../Consultant/CreateConsultant";
import { CustomButton } from "../../Buttons/Buttons";

const HeaderUser = () => {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <>
      <div className="h-16 w-full flex items-center justify-between px-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        {/* Logo/Brand Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">AC</span>
          </div>
          <h1 className="text-xl font-bold text-white">
            Admin Credit
          </h1>
        </div>
        
        {/* Actions Section */}
        <div className="flex items-center gap-3">
          <CustomButton 
            onClick={openModal} 
            text="modalTitle.createConsultant" 
            buttonType="modal" 
            additionalClasses="shadow-md"
          />
          <SwitchLang />
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} title="modalTitle.createConsultant" >
        <CreateConsultant />
      </Modal>
    </>
  );
};

export default HeaderUser;
