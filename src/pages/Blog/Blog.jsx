import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Helmet } from "react-helmet-async";

const Blog = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/blogs"); // Replace with your backend URL if deployed
      return res.data;
    },
  });

  if (isLoading)
    return <div className="text-center py-10">Loading blogs...</div>;

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Helmet>
        <title>Blog | My Insurance Platform</title>
      </Helmet>
      {blogs.map((blog) => (
        <div
          key={blog._id}
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-64 object-cover"
          />

          <div className="p-4 space-y-2">
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="text-sm text-gray-600">
              {blog.content?.split(" ").slice(0, 10).join(" ")}...
            </p>

            <div className="flex items-center mt-2 gap-2">
              <img
                src={`https://i.pravatar.cc/40?u=${blog.authorEmail}`}
                alt={blog.author}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded inline-block">
                  {blog.author}
                </p>
                <p className="text-xs text-gray-500">{blog.authorEmail}</p>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Published: {format(new Date(blog.publishDate), "PPP")}
            </p>

            <button
              onClick={() => setSelectedBlog(blog)}
              className="mt-3 inline-block bg-fuchsia-600 text-white text-sm px-4 py-2 rounded hover:bg-fuchsia-700 transition"
            >
              Read More
            </button>
          </div>
        </div>
      ))}

      {/* Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              &times;
            </button>
            <img
              src={selectedBlog.image}
              alt={selectedBlog.title}
              className="w-full h-96 object-cover rounded"
            />
            <h2 className="text-2xl font-bold mt-4">{selectedBlog.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              By <strong>{selectedBlog.author}</strong> (
              {selectedBlog.authorEmail}) on{" "}
              {format(new Date(selectedBlog.publishDate), "PPP")}
            </p>
            <p className="text-gray-700 mt-4">{selectedBlog.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
