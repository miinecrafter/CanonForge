import React, { useEffect, useState } from "react";
import api from "../api";
import { Link, useParams } from "react-router-dom";

export default function ReviewList() {
  const { projectId } = useParams();
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    api
      .get(`/api/projects/${projectId}/submissions?status=SUBMITTED`)
      .then(res => setSubs(res.data.submissions));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Review Submissions</h2>
      {subs.map((s: any) => (
        <div key={s.id}>
          <Link to={`/submission/${s.id}/review`}><b>{s.title}</b></Link>
        </div>
      ))}
    </div>
  );
}
