import { Logout } from "../../services/Hooks";
import LanguageSwitcher from "../Layout/SwitchLang";
import { LogOutButton } from "../Buttons/Buttons"
const handleLogout = async () => {
  await Logout();
};

const HeaderUser = () => {
  return (
    <>
      <div className="h-16 bg-white border-0 border-b-2 w-full flex justify-start gap-2 flex-row-reverse items-center px-4">
        {/* <button onClick={handleLogout} className="bg-green-500 text-white">Logout</button> */}
        <LogOutButton onClick={handleLogout} size="sm" />
        <LanguageSwitcher />
      </div>
    </>
  );
};

export default HeaderUser;
