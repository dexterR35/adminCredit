import { Logout } from "../services/Hooks";

const handleLogout = async () => {
  await Logout();
};

const HeaderUser = () => {
  return (
    <div className="h-16 bg-white shadow-md w-full flex justify-between flex-row-reverse items-center px-8 mb-5">
      <button onClick={handleLogout} className="bg-green-500 text-whit">Logout</button>

    </div>
  );
};

export default HeaderUser;
