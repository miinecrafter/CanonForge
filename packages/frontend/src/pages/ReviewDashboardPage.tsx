import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { Submission, Project } from '../types';

const ReviewDashboardPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [feedback, setFeedback] = useState('');
  const [decision, setDecision] = useState<string>('');
  const [canonNotes, setCanonNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      const [projectRes, submissionsRes] = await Promise.all([
        api.get(`/projects/${slug}`),
        api.get(`/projects/${slug}/submissions`, { params: { status: 'SUBMITTED' } }),
      ]);
      setProject(projectRes.data.project);
      setSubmissions(submissionsRes.data.submissions || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (submissionId: number) => {
    if (!feedback && !decision) {
      setError('Please provide feedback or a decision');
      return;
    }

    try {
      await api.post(`/submissions/${submissionId}/reviews`, {
        feedback,
        decision: decision || null,
      });

      // If approved, optionally canonize
      if (decision === 'APPROVED') {
        const shouldCanonize = window.confirm('Add this submission to canon?');
        if (shouldCanonize) {
          await api.post(`/submissions/${submissionId}/canonize`, {
            notes: canonNotes || null,
          });
        }
      }

      // Refresh data
      setFeedback('');
      setDecision('');
      setCanonNotes('');
      setSelectedSubmission(null);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return <div className="loading">Loading submissions...</div>;
  }

  if (error && !project) {
    return (
      <div className="card">
        <h2>Error</h2>
        <p className="text-muted">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Review Submissions</h1>
        <Link to={`/p/${slug}`} className="btn btn-secondary">Back to Project</Link>
      </div>

      {project && (
        <div className="card">
          <h2>{project.title}</h2>
          <p className="text-muted">{submissions.length} submissions awaiting review</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Submissions List */}
        <div>
          <div className="card">
            <h3>Pending Submissions</h3>
            {submissions.length === 0 ? (
              <p className="text-muted">No submissions to review</p>
            ) : (
              <div>
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub)}
                    style={{
                      padding: '1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #ddd',
                      backgroundColor: selectedSubmission?.id === sub.id ? '#e8f4f8' : 'transparent',
                    }}
                  >
                    <h4>{sub.title}</h4>
                    <p className="text-muted">By {sub.author.username}</p>
                    <span className={`status status-${sub.status.toLowerCase()}`}>
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Review Panel */}
        <div>
          {selectedSubmission ? (
            <div className="card">
              <h2>{selectedSubmission.title}</h2>
              <p className="text-muted">By {selectedSubmission.author.username}</p>
              
              <div 
                style={{ 
                  marginTop: '1.5rem', 
                  padding: '1.5rem', 
                  backgroundColor: '#f9f9f9', 
                  borderRadius: '4px',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}
                dangerouslySetInnerHTML={{ __html: selectedSubmission.content }}
              />

              <div style={{ marginTop: '2rem' }}>
                <h3>Submit Review</h3>
                
                <div className="form-group">
                  <label>Feedback</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide feedback to the author..."
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Decision</label>
                  <select value={decision} onChange={(e) => setDecision(e.target.value)}>
                    <option value="">-- Select Decision --</option>
                    <option value="APPROVED">Approve</option>
                    <option value="CHANGES_REQUESTED">Request Changes</option>
                    <option value="DECLINED">Decline</option>
                  </select>
                </div>

                {decision === 'APPROVED' && (
                  <div className="form-group">
                    <label>Canon Notes (optional)</label>
                    <textarea
                      value={canonNotes}
                      onChange={(e) => setCanonNotes(e.target.value)}
                      placeholder="Add any notes about how this fits into the canon..."
                      rows={2}
                    />
                  </div>
                )}

                {error && <div className="error">{error}</div>}

                <button 
                  onClick={() => handleReview(selectedSubmission.id)} 
                  className="btn"
                  style={{ width: '100%' }}
                >
                  Submit Review
                </button>
              </div>
            </div>
          ) : (
            <div className="card">
              <p className="text-muted">Select a submission to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewDashboardPage;