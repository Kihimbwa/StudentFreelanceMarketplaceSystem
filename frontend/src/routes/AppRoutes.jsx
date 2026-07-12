import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Jobs from "../pages/jobs/Jobs";
import StudentDashboard from "../pages/dashboard/StudentDashboard";
import ClientDashboard from "../pages/dashboard/ClientDashboard";
import ProtectedRoute from "./ProtectedRoute";


function AppRoutes() {
  return (
    <Routes>

      <Route element={<MainLayout />}>

  <Route path="/" element={<Home />} />

  <Route path="/login" element={<Login />} />

  <Route path="/register" element={<Register />} />

  <Route path="/jobs" element={<Jobs />} />

  <Route
  path="/dashboard"
  element={
    <ProtectedRoute role="student">
      <StudentDashboard />
    </ProtectedRoute>
  }
/>


<Route
  path="/client-dashboard"
  element={
    <ProtectedRoute role="client">
      <ClientDashboard />
    </ProtectedRoute>
  }
/>

        </Route>

    </Routes>
  );
}

export default AppRoutes;