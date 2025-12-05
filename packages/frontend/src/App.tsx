import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CreateProjectPage from './pages/CreateProjectPage';
import SubmissionEditorPage from './pages/SubmissionEditorPage';
import ReviewDashboardPage from './pages/ReviewDashboardPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';
import './styles.css';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/p/:slug" element={<ProjectDetailPage />} />
          <Route
            path="/projects/create"
            element={
              <PrivateRoute>
                <CreateProjectPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/p/:slug/submit"
            element={
              <PrivateRoute>
                <SubmissionEditorPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/p/:slug/review"
            element={
              <PrivateRoute>
                <ReviewDashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/submissions/:id/edit"
            element={
              <PrivateRoute>
                <SubmissionEditorPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;