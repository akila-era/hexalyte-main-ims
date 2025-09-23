import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components
import Navbar from "components/Navbars/AuthNavbar.js";
import FooterSmall from "components/Footers/FooterSmall.js";

// views
import Login from "views/auth/Login.js";
import Register from "views/auth/Register.js";
import Onboard from "views/auth/Onboard";

export default function Auth() {
  return (
    <>
      <main>
        <section className="relative w-full h-full min-h-screen bg-gray-50">
          {/* Main container with sidebar-like layout */}
          <div className="flex min-h-screen">
            {/* Left sidebar area - branding */}
            {/* <div className="hidden lg:flex lg:flex-col lg:w-80 bg-white border-r border-gray-200">
              <div className="flex flex-col justify-center items-center h-full p-8">
                <div className="text-center">
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Peymen</h1>
                    <div className="w-12 h-1 bg-indigo-500 mx-auto rounded-full"></div>
                  </div>
                  <div className="space-y-6 text-gray-600">
                    <div className="p-6 bg-gray-50 rounded-2xl">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Secure Access</h3>
                      <p className="text-sm">Your data is protected with enterprise-grade security</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-2xl">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                      <p className="text-sm">Experience blazing fast performance and response times</p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Right content area */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
              <div className="w-full max-w-md">
                <Switch>
                  <Route path="/auth/login" exact component={Login} />
                  <Route path="/auth/onboard/:userData" exact component={Onboard} />
                  <Redirect from="/auth" to="/auth/login" />
                </Switch>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}