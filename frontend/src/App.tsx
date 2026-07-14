import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute"; 

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import BrowseJobsPage from "./pages/jobs/BrowseJobsPage";
import JobDetailsPage from "./pages/jobs/JobDetailsPage";
import CreateJobPage from "./pages/jobs/CreateJobPage";
import EditJobPage from "./pages/jobs/EditJobPage";
import JobApplicantsPage from "./pages/jobs/JobApplicantsPage";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import StudentProfilePage from "./pages/profile/StudentProfilePage";
import ClientProfilePage from "./pages/profile/ClientProfilePage";
import MyApplicationsPage from "./pages/applications/MyApplicationsPage";
import ClientApplicationsPage from "./pages/applications/ClientApplicationsPage"; // <-- LIMEONGEZWA: Ukurasa mpya wa Client
import MessagesPage from "./pages/messages/MessagesPage";
import ReviewsPage from "./pages/reviews/ReviewsPage";
import NotFoundPage from "./pages/NotFoundPage";
import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/jobs" element={<PublicLayout><BrowseJobsPage /></PublicLayout>} />

            {/* Authenticated routes */}
            <Route path="/jobs/:id" element={
              <ProtectedRoute>
                <PublicLayout><JobDetailsPage /></PublicLayout>
              </ProtectedRoute>
            } />
            
            {/* Hapa sasa ni functionality maalum za Client (Mwajiri) */}
            <Route path="/jobs/create" element={
              <ProtectedRoute role="client">
                <PublicLayout><CreateJobPage /></PublicLayout>
              </ProtectedRoute>
            } />
            <Route path="/jobs/:id/edit" element={
              <ProtectedRoute role="client">
                <PublicLayout><EditJobPage /></PublicLayout>
              </ProtectedRoute>
            } />
            <Route path="/jobs/:id/applicants" element={
              <ProtectedRoute role="client">
                <PublicLayout><JobApplicantsPage /></PublicLayout>
              </ProtectedRoute>
            } />
            
            {/* Hapa ndipo njia mpya ya Client Applications ilipoongezwa ikiwa imelindwa */}
            <Route path="/applications" element={
              <ProtectedRoute role="client">
                <PublicLayout><ClientApplicationsPage /></PublicLayout>
              </ProtectedRoute>
            } />
            
            {/* Hizi ndizo Dashboard mbili tofauti kabisa zilizotenganishwa */}
            <Route path="/dashboard/student" element={
              <ProtectedRoute role="student">
                <DashboardLayout><StudentDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/client" element={
              <ProtectedRoute role="client">
                <DashboardLayout><ClientDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Profile na Njia nyingine za ndani */}
            <Route path="/profile/student/:id" element={
              <ProtectedRoute>
                <PublicLayout><StudentProfilePage /></PublicLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile/client/:id" element={
              <ProtectedRoute>
                <PublicLayout><ClientProfilePage /></PublicLayout>
              </ProtectedRoute>
            } />
            <Route path="/my-applications" element={
              <ProtectedRoute role="student">
                <PublicLayout><MyApplicationsPage /></PublicLayout>
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <PublicLayout><MessagesPage /></PublicLayout>
              </ProtectedRoute>
            } />
            <Route path="/reviews" element={
              <ProtectedRoute>
                <PublicLayout><ReviewsPage /></PublicLayout>
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}