import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./Pages/Home/HomePage";
import MainLayout from "./Components/Layout/Layout";
import ContractTable from "./Pages/ContractTable/ContractTable";
import ClientsWebPage from "./Pages/ClientsWebPage/ClientsWebPage";
import FormUser from "./Pages/Raports/AddUserRaport";
import LoginPage from "./Pages/Auth/LoginPage";
import ConsultantPage from "./Pages/Consultant/ConsultantPage";
import CreateConsultant from "./Components/Consultant/CreateConsultant";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoadingProgressProvider } from "./context/LoadingProgressContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoadingScreen = () => (
  <div className="flex h-screen items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="dash-spinner" />
      <p className="text-sm font-medium text-gray-500">Loading...</p>
    </div>
  </div>
);

const RootRedirect = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <MainLayout>{children}</MainLayout>;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/home" replace />;
  return <MainLayout>{children}</MainLayout>;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <Navigate to="/home" replace /> : children;
};

const AppShell = () => (
  <AuthProvider>
    <LoadingProgressProvider>
      <Outlet />
      <ToastContainer />
    </LoadingProgressProvider>
  </AuthProvider>
);

const router = createBrowserRouter(
  [
    {
      element: <AppShell />,
      children: [
        { path: "/", element: <RootRedirect /> },
        {
          path: "/login",
          element: (
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          ),
        },
        {
          path: "/home",
          element: (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/customers",
          element: (
            <ProtectedRoute>
              <ClientsWebPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/contract",
          element: (
            <ProtectedRoute>
              <ContractTable />
            </ProtectedRoute>
          ),
        },
        {
          path: "/newraport",
          element: (
            <ProtectedRoute>
              <FormUser />
            </ProtectedRoute>
          ),
        },
        {
          path: "/CreateConsultant",
          element: (
            <AdminRoute>
              <CreateConsultant />
            </AdminRoute>
          ),
        },
        {
          path: "/consultant",
          element: (
            <ProtectedRoute>
              <ConsultantPage />
            </ProtectedRoute>
          ),
        },
        { path: "*", element: <Navigate to="/home" replace /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const App = () => <RouterProvider router={router} />;

export default App;
