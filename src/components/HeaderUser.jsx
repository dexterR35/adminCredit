import { Logout } from "../services/Hooks";

const handleLogout = async () => {
  await Logout();
};

const HeaderUser = () => {
  return (
    <div className="h-16 bg-white border-0 border-b-2 w-full flex justify-start gap-2 flex-row-reverse items-center px-4">
      <button onClick={handleLogout} className="bg-green-500 text-white">Logout</button>
      <button className="bg-green-500 text-white">Create User</button>
    </div>
  );
};

export default HeaderUser;
