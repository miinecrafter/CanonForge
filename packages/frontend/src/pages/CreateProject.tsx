import React, { useState } from "react";
import api from "../api";

export default function CreateProject() {
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");

  const create = async () => {
  try {
      const res = await api.post("/api/projects", { title, description });
      console.log("Project created", { title, description });
      window.location.href = `/p/${res.data.project.slug}`;
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || "Error creating project");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Project</h2>
      <input placeholder="title" value={title} onChange={e => setTitle(e.target.value)} /><br/>
      <textarea placeholder="description" value={description} onChange={e => setDesc(e.target.value)} /><br/>
      <button onClick={create}>Create</button>
    </div>
  );
}
