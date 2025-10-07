// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const nav = useNavigate();
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#0f4c81,#0ea5a6)" }}
            >
              <span className="text-white font-bold">EB</span>
            </div>
            <div>
              <Link to="/" className="text-lg font-semibold text-bankBlue">
                EventEase Bank
              </Link>
              <div className="text-sm text-gray-400">International Payments</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!user && (
              <>
                <Link to="/login" className="text-sm text-gray-700 hover:text-bankBlue">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-sm px-3 py-2 bg-bankBlue text-white rounded-lg hover:opacity-90"
                >
                  Sign up
                </Link>
              </>
            )}
            {user && (
              <>
                {user.role === "admin" || user.role === "employee" ? (
                  <button
                    onClick={() => nav("/admin")}
                    className="text-sm px-3 py-2 bg-bankTeal text-white rounded-lg"
                  >
                    Portal
                  </button>
                ) : (
                  <button
                    onClick={() => nav("/dashboard")}
                    className="text-sm px-3 py-2 bg-bankBlue text-white rounded-lg"
                  >
                    Dashboard
                  </button>
                )}
                <button onClick={onLogout} className="text-sm text-gray-600 hover:text-red-600">
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
