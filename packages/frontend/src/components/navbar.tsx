import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ 
      padding: "10px 20px", 
      background: "#222", 
      color: "white",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <div>CanonForge</div>

      <div>
        {user ? (
          <>
            <span style={{ marginRight: 15 }}>
              Signed in as <b>{user.username}</b>
            </span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <a href="/login" style={{ color: "white" }}>
            Login
          </a>
        )}
      </div>
    </nav>
  );
}
