import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import useAuth from "../../../../hooks/useAuth";
import axiosSecure from "../../../../hooks/axiosSecure"; // must be an axios instance
import BlogModal from "./BlogModal";

const ManageBlogs = () => {
  const { user, role } = useAuth();
  const qc = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // ===== Fetch Blogs =====
  const {
    data: blogs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["blogs", role, user?.email],
    queryFn: async () => {
      const url =
        role?.toLowerCase() === "admin"
          ? "/blogs"
          : `/blogs?authorEmail=${encodeURIComponent(user?.email)}`;
      const { data } = await axiosSecure.get(url);
      return Array.isArray(data) ? data : data.items || [];
    },
    enabled: !!user?.email,
  });

  // ===== Create Blog =====
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosSecure.post("/blogs", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blogs"] });
      setIsModalOpen(false);
      setEditingBlog(null);
      Swal.fire("Published!", "Your blog post has been published.", "success");
    },
    onError: (err) => {
      console.error("Create Blog error:", err);
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to publish",
        "error"
      );
    },
  });

  // ===== Update Blog =====
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axiosSecure.patch(`/blogs/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blogs"] });
      setIsModalOpen(false);
      setEditingBlog(null);
      Swal.fire("Updated!", "Blog post updated successfully.", "success");
    },
    onError: (err) => {
      console.error("Update Blog error:", err);
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to update",
        "error"
      );
    },
  });

  // ===== Delete Blog =====
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.delete(`/blogs/${id}`);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blogs"] });
      Swal.fire("Deleted!", "Blog post deleted successfully.", "success");
    },
    onError: (err) => {
      console.error("Delete Blog error:", err);
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Failed to delete",
        "error"
      );
    },
  });

  const openCreateModal = () => {
    setEditingBlog(null);
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (res.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>
        <button onClick={openCreateModal} className="btn btn-primary">
          + Add New Blog
        </button>
      </header>

      {isLoading && <div className="text-center py-10">Loading...</div>}

      {isError && (
        <div className="text-center py-10 text-red-500">
          {error?.message || "Failed to load blogs"}
        </div>
      )}

      {!isLoading && !isError && blogs.length === 0 && (
        <div className="text-center py-10">No blogs found.</div>
      )}

      {!isLoading && !isError && blogs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th className="hidden md:table-cell">Author</th>
                <th className="hidden md:table-cell">Publish Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b, idx) => (
                <tr key={b._id}>
                  <td>{idx + 1}</td>
                  <td className="max-w-[320px] truncate" title={b.title}>
                    {b.title}
                  </td>
                  <td className="hidden md:table-cell">{b.author}</td>
                  <td className="hidden md:table-cell">
                    {b.publishDate
                      ? dayjs(b.publishDate).format("MMM D, YYYY h:mm A")
                      : "-"}
                  </td>
                  <td className="text-right space-x-2">
                    <button
                      onClick={() => openEditModal(b)}
                      className="btn btn-xs btn-outline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="btn btn-xs btn-error text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <BlogModal
          key={editingBlog?._id || "create"}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingBlog(null);
          }}
          onSubmit={(data) => {
            const payload = {
              ...data,
              author: user?.displayName || user?.email,
              authorEmail: user?.email,
            };
            if (editingBlog) {
              updateMutation.mutate({ id: editingBlog._id, payload });
            } else {
              createMutation.mutate(payload);
            }
          }}
          defaultValues={editingBlog}
          authorName={user?.displayName || user?.email}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default ManageBlogs;
