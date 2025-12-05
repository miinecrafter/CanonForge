import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/">
          <h1>CanonForge</h1>
        </Link>
        <div className="nav-links">
          <Link to="/projects">Projects</Link>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              {(user.role === 'WRITER' || user.role === 'ADMIN') && (
                <Link to="/projects/create">Create Project</Link>
              )}
              <span style={{ marginLeft: '1rem', color: '#ecf0f1' }}>
                {user.username}
              </span>
              <button onClick={logout} className="btn btn-secondary" style={{ marginLeft: '1rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;