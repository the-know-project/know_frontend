import PostCard from "./postcard";

const posts = [
  { id: 1, title: "The Man", views: "200K", comments: 22, createdAt: "1 week ago", image: "/art1.jpg" },
  { id: 2, title: "Soul Eyes", views: "700K", comments: 0, createdAt: "3 weeks ago", image: "/art2.jpg" },
  { id: 3, title: "Introspection", views: "39K", comments: 2, createdAt: "1 month ago", image: "/art3.jpg" },
  { id: 4, title: "Love in a letter", views: "100K", comments: 6, createdAt: "1 month ago", image: "/art4.jpg" },
];

export default function PostGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}