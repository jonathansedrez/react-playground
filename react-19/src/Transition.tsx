import { useState, useTransition } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

function Transition() {
  const [isPending, startTransition] = useTransition();
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = () => {
    startTransition(async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=5",
      );
      const data = await response.json();
      setPosts(data);
    });
  };

  return (
    <div>
      <button onClick={fetchPosts} disabled={isPending}>
        {isPending ? "Loading..." : "Fetch Posts"}
      </button>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Transition;
