import { Logout } from "../../services/Hooks";
import LanguageSwitcher from "../Layout/SwitchLang";
import { CustomButton } from "../Buttons/Buttons"
const handleLogout = async () => {
  await Logout();
};

const HeaderUser = () => {
  return (
    <>
      <div className="h-14 bg-white shadow-md w-full flex justify-start gap-2 flex-row-reverse items-center px-10">
        <CustomButton onClick={handleLogout} size="sm" />
        <LanguageSwitcher />
      </div>
    </>
  );
};

export default HeaderUser;
