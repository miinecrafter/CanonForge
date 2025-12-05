import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Project } from '../types';

const ProjectDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProject();
  }, [slug]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${slug}`);
      setProject(response.data.project);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading project...</div>;
  }

  if (error || !project) {
    return (
      <div className="card">
        <h2>Project Not Found</h2>
        <p className="text-muted">{error || 'This project does not exist.'}</p>
        <Link to="/projects" className="btn">Back to Projects</Link>
      </div>
    );
  }

  const isOwner = project.owners.some(o => o.user.id === user?.id);

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <div>
            <h1>{project.title}</h1>
            <p className="text-muted">
              Created by {project.owners.map(o => o.user.username).join(', ')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/p/${project.slug}/submit`} className="btn btn-success">Submit Story</Link>
            {isOwner && (
              <Link to={`/p/${project.slug}/review`} className="btn">Review Submissions</Link>
            )}
          </div>
        </div>
        <p>{project.description}</p>
      </div>

      <div className="card">
        <h2>Canonical Stories</h2>
        {!project.canonEntries || project.canonEntries.length === 0 ? (
          <p className="text-muted">No canonical stories yet. Be the first to contribute!</p>
        ) : (
          <div>
            {project.canonEntries.map((entry) => (
              <div key={entry.id} style={{ padding: '1.5rem', borderBottom: '1px solid #ddd' }}>
                <h3>{entry.submission.title}</h3>
                <p className="text-muted">By {entry.submission.author.username}</p>
                <div 
                  style={{ marginTop: '1rem' }}
                  dangerouslySetInnerHTML={{ __html: entry.submission.content }}
                />
                {entry.notes && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                    <strong>Canon Notes:</strong> {entry.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;