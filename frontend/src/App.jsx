import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Sell from "./pages/Sell";
import CarDetails from "./pages/CarDetails";
import Admin from "./pages/Admin";

// 🔐 Admin Route Guard
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "ADMIN" ? children : <Navigate to="/home" />;
};

// 🔐 Auth Guard
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route
          path="/"
          element={
            localStorage.getItem("token")
              ? <Navigate to="/home" />
              : <Navigate to="/login" />
          }
        />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/sell"
          element={
            <PrivateRoute>
              <Sell />
            </PrivateRoute>
          }
        />

        <Route
          path="/car/:id"
          element={
            <PrivateRoute>
              <CarDetails />
            </PrivateRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
