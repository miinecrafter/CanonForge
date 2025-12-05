import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

export default function ProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    api.get(`/api/projects/${slug}`).then(res => setProject(res.data.project));
  }, [slug]);

  if (!project) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{project.title}</h2>
      <p>{project.description}</p>

      <Link to={`/p/${project.slug}/submit`}>Submit Story</Link><br/>
      <Link to={`/p/${project.slug}/review`}>Review Submissions</Link>

      <h3>Canon Stories</h3>
      {project.canonEntries.map((entry: any) => (
        <div key={entry.id} style={{ marginBottom: 10 }}>
          <b>{entry.submission.title}</b>
          <div
            dangerouslySetInnerHTML={{ __html: entry.submission.content }}
          />
        </div>
      ))}
    </div>
  );
}
