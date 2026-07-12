import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Jobs from "../pages/jobs/Jobs";
import StudentDashboard from "../pages/dashboard/StudentDashboard";
import ClientDashboard from "../pages/dashboard/ClientDashboard";
import ProtectedRoute from "./ProtectedRoute";
import CreateJob from "../pages/jobs/CreateJob";
import JobDetails from "../pages/jobs/JobDetails";
import MyApplications from "../pages/applications/MyApplications";
import JobApplicants from "../pages/applications/JobApplicants";
import StudentProfile from "../pages/profile/StudentProfile";
import ClientProfile from "../pages/profile/ClientProfile";

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

<Route 
path="/create-job" 
element={<CreateJob />} 
/>

<Route

path="/jobs/:id"

element={<JobDetails/>}

/>

<Route

path="/my-applications"

element={<MyApplications/>}

/>



<Route

path="/job/:id/applicants"

element={<JobApplicants/>}

/>

<Route

path="/student-profile"

element={<StudentProfile/>}

/>



<Route

path="/client-profile"

element={<ClientProfile/>}

/>

        </Route>

    </Routes>
  );
}

export default AppRoutes;