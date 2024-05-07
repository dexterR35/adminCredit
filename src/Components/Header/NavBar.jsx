import { Logout } from "../../services/Hooks";
import LanguageSwitcher from "../Layout/SwitchLang";
import { CustomButton } from "../Buttons/Buttons";
import Modal from "../Modal/Modal";
import useModal from "../Modal/useModal";
import CreateConsultant from "../Consultant/CreateConsultant";

const HeaderUser = () => {
  const { isOpen, openModal, closeModal } = useModal();

  const handleLogout = async () => {
    await Logout();
  };

  return (
    <>
      <div className="h-14 bg-white shadow-md w-full flex justify-start gap-2 flex-row-reverse items-center px-10">
        <CustomButton onClick={handleLogout} text="Log Out" buttonType="logout" />
        <LanguageSwitcher />
        {/* Ensure that the CustomButton is configured to open the modal */}
        <CustomButton onClick={openModal} text="Open Modal" />
      </div>
      {/* Render the modal outside of the header div */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <h2>Modal Content</h2>
        <CreateConsultant />
      </Modal>
    </>
  );
};

export default HeaderUser;
