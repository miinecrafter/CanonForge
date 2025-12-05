import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/api/projects").then(res => setProjects(res.data.projects));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Projects</h2>
      {projects.map((p: any) => (
        <div key={p.id} style={{ marginBottom: 10 }}>
          <Link to={`/p/${p.slug}`}><b>{p.title}</b></Link>
        </div>
      ))}
    </div>
  );
}
