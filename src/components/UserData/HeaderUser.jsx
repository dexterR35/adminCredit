import { logout } from "../../services/authService";

const handleLogout = async () => {
  await logout();
};

const HeaderUser = () => {
  return (
    <div className="h-16 bg-red-500 w-full flex justify-end items-center px-8 mb-20">
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HeaderUser;
