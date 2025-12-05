import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import TipTapEditor from '../components/TipTapEditor';
import { Submission, Project } from '../types';

const SubmissionEditorPage = () => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('<p>Start writing your story...</p>');
  const [project, setProject] = useState<Project | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Fetch project or submission on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          // Editing existing submission
          const response = await api.get(`/submissions/${id}`);
          const sub = response.data.submission;
          setSubmission(sub);
          setTitle(sub.title);
          setContent(sub.content);
          setProject(sub.project);
        } else if (slug) {
          // Creating new submission
          const response = await api.get(`/projects/${slug}`);
          setProject(response.data.project);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load data');
      }
    };
    fetchData();
  }, [slug, id]);

  // Auto-save functionality
  useEffect(() => {
    if (!submission && !project) return;
    
    const timer = setTimeout(() => {
      if (title && content && saveStatus === 'unsaved') {
        handleSave(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content, saveStatus]);

  const handleSave = async (isDraft = true) => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setSaveStatus('saving');
    setError('');

    try {
      if (submission) {
        // Update existing
        await api.patch(`/submissions/${submission.id}`, {
          title,
          content,
        });
      } else if (project) {
        // Create new
        const response = await api.post(`/projects/${project.id}/submissions`, {
          title,
          content,
        });
        setSubmission(response.data.submission);
      }
      setSaveStatus('saved');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save');
      setSaveStatus('unsaved');
    }
  };

  const handleSubmitForReview = async () => {
    if (!submission) {
      await handleSave();
      // Wait a moment for state to update
      setTimeout(async () => {
        if (submission) {
          await submitForReview();
        }
      }, 500);
    } else {
      await submitForReview();
    }
  };

  const submitForReview = async () => {
    if (!submission) return;
    
    setLoading(true);
    try {
      await api.post(`/submissions/${submission.id}/submit`);
      navigate(`/p/${project?.slug || slug}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (html: string) => {
    setContent(html);
    setSaveStatus('unsaved');
  };

  if (error && !project && !submission) {
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
        <h1>{submission ? 'Edit Submission' : 'New Submission'}</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="text-muted" style={{ marginRight: '1rem' }}>
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'saved' && 'Saved ✓'}
            {saveStatus === 'unsaved' && 'Unsaved changes'}
          </span>
          <button 
            onClick={() => handleSave()} 
            className="btn btn-secondary"
            disabled={loading}
          >
            Save Draft
          </button>
          <button 
            onClick={handleSubmitForReview} 
            className="btn btn-success"
            disabled={loading || !title || !content}
          >
            Submit for Review
          </button>
        </div>
      </div>

      {project && (
        <div className="card">
          <h3>Project: {project.title}</h3>
          <p className="text-muted">{project.description}</p>
        </div>
      )}

      <div className="card">
        <div className="form-group">
          <label>Story Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSaveStatus('unsaved');
            }}
            placeholder="Give your story a title..."
            style={{ fontSize: '1.25rem', fontWeight: '500' }}
          />
        </div>
      </div>

      <TipTapEditor content={content} onChange={handleContentChange} />

      {error && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="error">{error}</div>
        </div>
      )}
    </div>
  );
};

export default SubmissionEditorPage;