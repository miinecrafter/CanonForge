import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Project } from '../types';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [search]);

  const fetchProjects = async () => {
    try {
      const params = search ? { q: search } : {};
      const response = await api.get('/projects', { params });
      setProjects(response.data.projects || []);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Explore Projects</h1>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      {projects.length === 0 ? (
        <div className="card">
          <p className="text-muted">No projects found. Be the first to create one!</p>
        </div>
      ) : (
        <div className="card-list">
          {projects.map((project) => (
            <div key={project.id} className="card">
              <h3>{project.title}</h3>
              <p className="text-muted" style={{ marginBottom: '1rem' }}>
                {project.description || 'No description provided'}
              </p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '1rem' }}>
                <span>{project._count?.submissions || 0} submissions</span>
                <span>{project._count?.canonEntries || 0} canonical</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/p/${project.slug}`} className="btn">View Project</Link>
                <Link to={`/p/${project.slug}/submit`} className="btn btn-success">Submit Story</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;