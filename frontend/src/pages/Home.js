// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-bank-soft flex items-center justify-center p-6">
      <div className="max-w-3xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-xl shadow">
          <h3 className="text-2xl font-bold text-bankBlue">Customer</h3>
          <p className="mt-2 text-gray-600">
            Make international payments and track their status easily.
          </p>
          <div className="mt-6 space-x-3">
            <Link
              to="/login"
              className="inline-block bg-bankBlue text-white py-2 px-4 rounded hover:opacity-90"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-block border py-2 px-4 rounded hover:bg-gray-100"
            >
              Create account
            </Link>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow">
          <h3 className="text-2xl font-bold text-bankBlue">Employee / Admin</h3>
          <p className="mt-2 text-gray-600">
            Process pending transactions and verify customer payments.
          </p>
          <div className="mt-6">
            <Link
              to="/login"
              className="inline-block bg-bankBlue text-white py-2 px-4 rounded hover:opacity-90"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
