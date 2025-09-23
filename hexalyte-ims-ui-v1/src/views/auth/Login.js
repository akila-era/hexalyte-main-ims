import React from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "context/AuthContext";
import checkToken from "api/checkToken";
import { storeTokens } from "auth/tokenService";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Login() {
  const history = useHistory();
  const { setAuth } = useAuth();

  const [login, setLogin] = React.useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [isLoading, setIsLoading] = React.useState(false);

  function handleChange(e) {
    setLogin((l) => ({ ...l, [e.target.name]: e.target.value }));
  }

  function jsonToBase64(object) {
    const stringified = JSON.stringify(object);
    return btoa(String.fromCharCode(...new TextEncoder().encode(stringified)));
  }

  async function Login(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}auth/login`, login);
      console.log(res);

      if (res.data.message === "Login successful") {
        const store = storeTokens(res.data);
        setAuth(() => true);
        history.push("/admin");
      }
    } catch (e) {
      if (e.status === 500) {
        Swal.fire({
          title: "Oops",
          text: "Invalid Credentials",
          icon: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mobile logo */}
      <div className="lg:hidden text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Peymen</h1>
        <div className="w-12 h-1 bg-indigo-500 mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-500">Please sign in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={(e) => Login(e)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all duration-200 placeholder-gray-400"
              placeholder="Enter your email"
              onChange={(e) => handleChange(e)}
              value={login.email}
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all duration-200 placeholder-gray-400"
              placeholder="Enter your password"
              onChange={(e) => handleChange(e)}
              value={login.password}
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                onChange={(e) => setLogin((l) => ({ ...l, rememberMe: e.target.checked }))}
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Stats/Features section similar to dashboard cards */}
        {/* <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <div className="text-lg font-bold text-gray-900">99.9%</div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-2xl">
              <div className="text-lg font-bold text-indigo-600">24/7</div>
              <div className="text-sm text-gray-500">Support</div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Footer text */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Need help? <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">Contact support</a>
        </p>
      </div>
    </div>
  );
}