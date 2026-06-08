import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import PropTypes from "prop-types";
import HomePage from "./Pages/Home/HomePage";
import MainLayout from "./Components/Layout/Layout";
import ContractTable from "./Pages/ContractTable/ContractTable";
import ClientsWebPage from "./Pages/ClientsWebPage/ClientsWebPage";
import FormUser from "./Pages/Raports/AddUserRaport";
import LoginPage from "./Pages/Auth/LoginPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoadingProgressProvider } from "./context/LoadingProgressContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ErrorBoundary } from "./Components/ErrorBoundary";
import { getRouterBasename } from "./utils/router";

const LoadingScreen = () => (
  <div className="flex h-screen items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="loading-spinner" />
      <p className="text-sm font-medium text-gray-500">Loading...</p>
    </div>
  </div>
);

const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
};

const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <MainLayout />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <Navigate to="/home" replace /> : children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const AppShell = () => (
  <ErrorBoundary>
    <AuthProvider>
      <LoadingProgressProvider>
        <Outlet />
        <ToastContainer />
      </LoadingProgressProvider>
    </AuthProvider>
  </ErrorBoundary>
);

const routerBasename = getRouterBasename();

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
          element: <ProtectedLayout />,
          children: [
            { path: "/home", element: <HomePage /> },
            { path: "/customers", element: <ClientsWebPage /> },
            { path: "/contract", element: <ContractTable /> },
            { path: "/newraport", element: <FormUser /> },
          ],
        },
        { path: "*", element: <Navigate to="/home" replace /> },
      ],
    },
  ],
  {
    ...(routerBasename ? { basename: routerBasename } : {}),
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const App = () => (
  <ErrorBoundary message="The application failed to load. Please reload the page.">
    <RouterProvider router={router} />
  </ErrorBoundary>
);

export default App;
