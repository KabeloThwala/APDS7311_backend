import React, { useEffect, useState } from "react";
import api from "../api";

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts")
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map(p => (
          <li key={p._id}>
            <strong>{p.title}</strong> by {p.author?.fullname || "unknown"}<br />
            {p.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default PostList;
