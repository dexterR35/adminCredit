import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Login } from "../../services/Hooks";
import { InputField } from "../../Components/Inputs";
import { useTrackLoading } from "../../Components/LoadingProgress";
import { sanitizeEmail, sanitizePassword } from "../../utils/sanitize";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useTrackLoading(isLoading);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError(null);

    try {
      if (!email || !password) {
        setError("Please enter both email and password.");
        return;
      }

      setIsLoading(true);
      await Login(sanitizeEmail(email), sanitizePassword(password));
      navigate("/home");
    } catch (loginError) {
      if (loginError.code === "invalid_credentials") {
        setError(loginError.message);
      } else {
        setError(loginError.message || "Sign in failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="animate-slide-up rounded-xl border border-gray-200 bg-white p-8 shadow-soft">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600">
              <span className="text-lg font-bold text-white">OC</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Obtine Credit</h1>
            <p className="mt-2 text-sm text-gray-500">Sign in to the admin dashboard</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <InputField
              label="Email"
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
              required
            />

            <InputField
              label="Password"
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="dash-btn dash-btn-primary w-full py-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Secure login powered by Supabase
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
