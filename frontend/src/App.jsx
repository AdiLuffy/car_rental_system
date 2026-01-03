import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from"../context/AuthContext";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Sell from "./pages/Sell";
import Admin from "./pages/Admin";

import AdminRoute from "./routes/AdminRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default route → Login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* After login */}
          <Route path="/home" element={<Home />} />
          <Route path="/sell" element={<Sell />} />

          {/* Admin protected */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
