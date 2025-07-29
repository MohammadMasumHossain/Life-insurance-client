import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Dialog } from '@headlessui/react';

const bgColors = ['bg-pink-50', 'bg-green-50', 'bg-yellow-50', 'bg-blue-50'];

const LatestBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3000/blogs')
      .then(res => setBlogs(res.data.slice(0, 4))) // Ensure max 4 blogs
      .catch(err => console.error('Error fetching blogs:', err));
  }, []);

  const openModal = blog => {
    setSelectedBlog(blog);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedBlog(null);
    setIsOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h2 className="text-4xl font-extrabold text-center mb-2 text-black">
        Latest Blog & Articles
      </h2>
      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
        Stay updated with the latest insights, news, and tips from our experts. Explore our newest articles below.
      </p>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {blogs.map((blog, index) => (
          <div
            key={blog._id}
            className={`${bgColors[index % bgColors.length]} rounded-lg shadow-lg p-6 flex flex-col hover:shadow-2xl transition-shadow duration-300`}
          >
            <h3 className="text-xl font-bold mb-2 text-black line-clamp-2">
              {blog.title}
            </h3>
            <p className="text-gray-700 mb-4 line-clamp-2">{blog.content}</p>
            <button
              onClick={() => openModal(blog)}
              className="mt-auto inline-block bg-sky-600 hover:bg-sky-700 hover:bg-sky-700 text-white font-semibold px-5 py-2 rounded-md transition"
            >
              Read More
            </button>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button
          onClick={() => navigate('/blog')}
          className="inline-block bg-sky-600 hover:bg-sky-700 hover:bg-sky-700 text-white font-semibold px-8 py-3 rounded-md transition"
        >
          All Blogs & Articles
        </button>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <Dialog.Title className="text-2xl font-bold mb-4 text-fuchsia-600">
              {selectedBlog?.title}
            </Dialog.Title>

            {selectedBlog?.image && (
              <img
                src={selectedBlog.image}
                alt="Blog"
                className="w-full h-60 object-cover rounded-md mb-4"
              />
            )}

            <p className="text-gray-800 mb-6 whitespace-pre-wrap">
              {selectedBlog?.content}
            </p>

            {/* Show author name and email only */}
            {(selectedBlog?.author || selectedBlog?.authorEmail) && (
              <div className="border-t pt-4 text-sm text-gray-600">
                {selectedBlog?.author && <p><strong>Author:</strong> {selectedBlog.author}</p>}
                {selectedBlog?.authorEmail && <p><strong>Email:</strong> {selectedBlog.authorEmail}</p>}
              </div>
            )}

            <div className="text-right mt-6">
              <button
                onClick={closeModal}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md font-medium"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default LatestBlog;
