import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Project, Submission } from '../types';

const DashboardPage = () => {
  const { user } = useAuth();
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we'd have endpoints for user-specific projects and submissions
        // For now, we'll just show all projects
        const projectsRes = await api.get('/projects');
        setMyProjects(projectsRes.data.projects || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>My Dashboard</h1>
      </div>

      <div className="card">
        <h2>Welcome back, {user?.username}!</h2>
        <p className="text-muted">Role: {user?.role}</p>
      </div>

      {(user?.role === 'WRITER' || user?.role === 'ADMIN') && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>My Projects</h2>
            <Link to="/projects/create" className="btn">Create New Project</Link>
          </div>
          {myProjects.length === 0 ? (
            <p className="text-muted">You haven't created any projects yet.</p>
          ) : (
            <div className="card-list">
              {myProjects.map((project) => (
                <div key={project.id} className="card">
                  <h3>{project.title}</h3>
                  <p className="text-muted">{project.description}</p>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/p/${project.slug}`} className="btn btn-secondary">View</Link>
                    <Link to={`/p/${project.slug}/review`} className="btn">Review Submissions</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="card">
        <h2>My Submissions</h2>
        {mySubmissions.length === 0 ? (
          <p className="text-muted">You haven't made any submissions yet. Browse projects to get started!</p>
        ) : (
          <div>
            {mySubmissions.map((submission) => (
              <div key={submission.id} style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                <h3>{submission.title}</h3>
                <span className={`status status-${submission.status.toLowerCase()}`}>
                  {submission.status}
                </span>
                <p className="text-muted">Project: {submission.project?.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;