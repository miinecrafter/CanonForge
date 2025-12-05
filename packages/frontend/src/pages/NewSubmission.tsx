import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Editor from "../components/Editor";

export default function NewSubmission() {
  const { slug  } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("<p></p>");

  const save = async () => {
    await api.post(`/api/projects/${ slug }/submissions`, {
      title,
      content
    });
    window.location.href = `/p/${ slug }`;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>New Submission</h2>
      <input placeholder="title" value={title} onChange={e => setTitle(e.target.value)} />
      <Editor content={content} setContent={setContent} />
      <button onClick={save}>Save Draft</button>
    </div>
  );
}
