import React from 'react';
import SwitchLang from "../SwitchLang";
import { useModal, Modal } from "../../Modal/useModal";
import CreateConsultant from "../../Consultant/CreateConsultant";
import { CustomButton } from "../../Buttons/Buttons";

const HeaderUser = () => {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <>
      <div className="h-14 bg-white shadow-md w-full flex gap-2 flex-row items-center justify-end px-10">
        <CustomButton onClick={openModal} text="modalTitle.createConsultant" buttonType="modal" />
        <SwitchLang />
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} title="modalTitle.createConsultant" >
        <CreateConsultant />
      </Modal>
    </>
  );
};

export default HeaderUser;
