import React from 'react';
import { useModal, Modal } from "../../Modal/useModal";
import CreateConsultant from "../../Consultant/CreateConsultant";
import { CustomButton } from "../../Buttons/Buttons";

const HeaderUser = () => {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <>
      <div className="h-16 w-full flex items-center justify-between px-6">
        {/* Logo/Brand Section */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">AC</span>
          </div>
          <h1 className="text-lg font-semibold text-slate-100 tracking-tight">
            Admin Credit
          </h1>
        </div>
        
        {/* Actions Section */}
        <div className="flex items-center gap-3">
          <CustomButton 
            onClick={openModal} 
            text="Create Consultant" 
            buttonType="modal" 
            additionalClasses="text-sm"
          />
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} title="Create Consultant" >
        <CreateConsultant />
      </Modal>
    </>
  );
};

export default HeaderUser;
