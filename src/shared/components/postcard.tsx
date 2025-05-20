// import { Eye, MessageCircle, Edit2 } from "luci";
import { FaEye } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";

export default function PostCard({ post }: { post: any }) {
  return (
    <div className="border rounded overflow-hidden shadow-sm bg-white">
      <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
      <div className="p-2">
        <h3 className="font-medium text-sm mb-1">{post.title}</h3>
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaEye className="w-4 h-4" /> {post.views}
            <FaRegMessage className="w-4 h-4" /> {post.comments}
          </div>
          <span className="text-gray-400">{post.createdAt}</span>
          <CiEdit className="w-4 h-4 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}