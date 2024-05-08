import { Logout } from "../../../services/Hooks";
import SwitchLang from "../SwitchLang";
import { CustomButton } from "../../Buttons/Buttons";
import Modal from "../../Modal/Modal";
import useModal from "../../Modal/useModal";
import CreateConsultant from "../../Consultant/CreateConsultant";

const HeaderUser = () => {
  const { isOpen, openModal, closeModal } = useModal();

  const handleLogout = async () => {
    await Logout();
  };

  return (
    <>
      <div className="h-14 bg-white shadow-md w-full flex justify-start gap-2 flex-row-reverse items-center px-10">
        <CustomButton onClick={handleLogout} text="Log Out" buttonType="submit" />
        <CustomButton onClick={openModal} text="Create Consultant" buttonType="modal" />
        <SwitchLang />
      </div>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <CreateConsultant />
      </Modal>
    </>
  );
};

export default HeaderUser;
