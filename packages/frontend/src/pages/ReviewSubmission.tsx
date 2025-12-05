import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function ReviewSubmission() {
  const { id } = useParams();
  const [sub, setSub] = useState<any>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    api.get(`/api/submissions/${id}`).then(res => setSub(res.data.submission));
  }, []);

  const sendReview = async (decision: string) => {
    await api.post(`/api/submissions/${id}/reviews`, { feedback, decision });
    window.location.href = "/";
  };

  const canonize = async () => {
    await api.post(`/api/submissions/${id}/canonize`);
    window.location.href = "/";
  };

  if (!sub) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{sub.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: sub.content }} />

      <textarea
        placeholder="feedback"
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
      /><br/>

      <button onClick={() => sendReview("APPROVED")}>Approve</button>
      <button onClick={() => sendReview("DECLINED")}>Decline</button>
      <button onClick={() => sendReview("CHANGES_REQUESTED")}>Request Changes</button>

      <hr />
      <button onClick={canonize}>Add to Canon</button>
    </div>
  );
}
