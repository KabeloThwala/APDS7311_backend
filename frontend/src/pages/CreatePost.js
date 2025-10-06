import React, { useState } from "react";
import api from "../api";

function CreatePost() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [message, setMessage] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/posts", form);
      setMessage("Post created!");
      console.log("Post created:", res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} /><br />
        <textarea name="content" placeholder="Content" onChange={handleChange} /><br />
        <button type="submit">Create</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
export default CreatePost;
