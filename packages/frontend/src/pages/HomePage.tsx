import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#2c3e50' }}>
        Welcome to CanonForge
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#7f8c8d', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
        A platform where writers create universes and readers contribute stories that become part of the official canon.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/projects" className="btn" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
          Explore Projects
        </Link>
        {!user && (
          <Link to="/register" className="btn btn-success" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
            Get Started
          </Link>
        )}
      </div>
      {user && (user.role === 'WRITER' || user.role === 'ADMIN') && (
        <div style={{ marginTop: '2rem' }}>
          <Link to="/projects/create" className="btn btn-success" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
            Create Your Universe
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;