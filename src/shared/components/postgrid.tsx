import PostCard from "./postcard";

const posts = [
  { id: 1, title: "The Man", views: "200K", comments: 22, createdAt: "1 week ago", image: "/Art1.png" },
  { id: 2, title: "Soul Eyes", views: "700K", comments: 0, createdAt: "3 weeks ago", image: "/Art2.png" },
  { id: 3, title: "Introspection", views: "39K", comments: 2, createdAt: "1 month ago", image: "/Art3.png" },
  { id: 4, title: "Love in a letter", views: "100K", comments: 6, createdAt: "1 month ago", image: "/Art4.png" },
];

export default function PostGrid() {
  return (
    <div className="grid bg-white grid-cols-2 md:grid-cols-3 gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}