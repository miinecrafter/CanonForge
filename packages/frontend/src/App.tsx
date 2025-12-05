import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import ProjectPage from "./pages/ProjectPage";
import CreateProject from "./pages/CreateProject";
import NewSubmission from "./pages/NewSubmission";
import ReviewList from "./pages/ReviewList";
import ReviewSubmission from "./pages/ReviewSubmission";
import Navbar from "./components/navbar";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <nav style={{ padding: 10, borderBottom: "1px solid #ccc" }}>
        <Link to="/">Projects</Link> |{" "}
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link> |{" "}
        <Link to="/projects/new">Create Project</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/projects/new" element={<CreateProject />} />
        <Route path="/p/:slug" element={<ProjectPage />} />

        <Route path="/p/:slug/submit" element={<NewSubmission />} />

        <Route path="/p/:projectId/review" element={<ReviewList />} />
        <Route path="/submission/:id/review" element={<ReviewSubmission />} />
      </Routes>
    </BrowserRouter>
  );
}
