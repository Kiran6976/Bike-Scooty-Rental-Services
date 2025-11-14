import React from "react";
import { NavLink } from "react-router-dom";

export default function Profile() {
  const isLoggedIn = false; // replace with actual auth logic
  const orders = [
    { id: "#12345", bike: "Yamaha R15", date: "2025-08-10", status: "Completed" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold">Bike Book</h1>
          <nav className="space-x-6">
            <NavLink to="/" className="hover:underline">
              Home
            </NavLink>
            <NavLink to="/rentbike" className="hover:underline">
              Rent Bikes
            </NavLink>
            <a href="#testimonial" className="hover:underline">
              Testimonial
            </a>
            <a href="#contact" className="hover:underline">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-10 px-6">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">My Profile</h2>
          {!isLoggedIn && (
            <p className="text-red-500 mb-6">You are not logged in.</p>
          )}

          {/* Tabs */}
          <div className="flex space-x-6 mb-6 border-b pb-2">
            <button className="text-blue-600 font-semibold hover:underline">
              Edit Profile
            </button>
            <button className="text-blue-600 font-semibold hover:underline">
              Order History
            </button>
          </div>

          {/* Order History */}
          <h3 className="text-xl font-semibold mb-4">Order History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Order ID</th>
                  <th className="py-2 px-4 border">Bike</th>
                  <th className="py-2 px-4 border">Date</th>
                  <th className="py-2 px-4 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-2 px-4 border">{order.id}</td>
                    <td className="py-2 px-4 border">{order.bike}</td>
                    <td className="py-2 px-4 border">{order.date}</td>
                    <td className="py-2 px-4 border text-green-600 font-semibold">
                      {order.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          &copy; {new Date().getFullYear()} Bike Book. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
