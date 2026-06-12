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
import { AUTH_SCOPES, hasScope } from "./utils/authSecurity";

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

const ForbiddenScreen = () => (
  <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
    <div className="max-w-md rounded-xl border border-gray-200 bg-white p-6 text-center shadow-soft">
      <h1 className="text-lg font-semibold text-gray-900">Access denied</h1>
      <p className="mt-2 text-sm text-gray-500">
        Your account does not have permission to open this page.
      </p>
    </div>
  </div>
);

const ProtectedLayout = ({ scope }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (scope && !hasScope(user, scope)) return <ForbiddenScreen />;
  return <MainLayout />;
};

ProtectedLayout.propTypes = {
  scope: PropTypes.string,
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
          element: <ProtectedLayout scope={AUTH_SCOPES.DASHBOARD_READ} />,
          children: [
            { path: "/home", element: <HomePage /> },
          ],
        },
        {
          element: <ProtectedLayout scope={AUTH_SCOPES.CLIENTS_READ} />,
          children: [
            { path: "/customers", element: <ClientsWebPage /> },
          ],
        },
        {
          element: <ProtectedLayout scope={AUTH_SCOPES.CONTRACTS_READ} />,
          children: [
            { path: "/contract", element: <ContractTable /> },
          ],
        },
        {
          element: <ProtectedLayout scope={AUTH_SCOPES.FISA_WRITE} />,
          children: [
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
