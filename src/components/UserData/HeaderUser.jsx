import { Logout } from "../../services/authService";
import Countdown from "../CountDown";
const handleLogout = async () => {
  await Logout();
};

const HeaderUser = () => {
  return (
    <div className="h-16 bg-green-300 w-full flex justify-between flex-row-reverse items-center px-8 mb-5">
      <button onClick={handleLogout}>Logout</button>
      <Countdown />
    </div>
  );
};

export default HeaderUser;
