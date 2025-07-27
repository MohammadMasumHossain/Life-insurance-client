import { useMemo, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const BlogModal = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  authorName,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: useMemo(
      () => ({
        title: defaultValues?.title || "",
        content: defaultValues?.content || "",
      }),
      [defaultValues]
    ),
  });

  const isEditing = !!defaultValues?._id;

  // ---------- image state ----------
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(defaultValues?.image || "");
  const [isUploading, setIsUploading] = useState(false);

  const IMGBB_KEY = import.meta.env.VITE_IMGBB_KEY;

  // Cleanup preview URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (image only)
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Invalid File Type",
        text: "Please select a valid image file.",
      });
      return;
    }

    // Validate max file size (2MB)
    const MAX_MB = 2;
    if (file.size / 1024 / 1024 > MAX_MB) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: `Please select an image smaller than ${MAX_MB}MB.`,
      });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadToImgBB = async (file) => {
    if (!IMGBB_KEY) {
      throw new Error("Missing IMGBB API key (VITE_IMGBB_KEY).");
    }

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    if (!json.success) {
      throw new Error(json?.error?.message || "Image upload failed");
    }
    return json.data.url;
  };

  const submit = async (payload) => {
    try {
      let imageUrl = defaultValues?.image || "";

      if (imageFile) {
        setIsUploading(true);
        imageUrl = await uploadToImgBB(imageFile);
        setIsUploading(false);
      }

      onSubmit({
        ...payload,
        author: authorName,
        image: imageUrl,
      });
    } catch (err) {
      setIsUploading(false);
      console.error("Image upload error:", err);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message || "Image upload failed",
      });
    }
  };

  const close = () => {
    reset();
    setImageFile(null);
    setImagePreview(defaultValues?.image || "");
    onClose();
  };

  return (
    <dialog open={isOpen} className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-lg mb-4">
          {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
        </h3>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              placeholder="Enter blog title"
              className="input input-bordered w-full"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="label">
              <span className="label-text">Content</span>
            </label>
            <textarea
              rows={8}
              placeholder="Write your content..."
              className="textarea textarea-bordered w-full"
              {...register("content", { required: "Content is required" })}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="label">
              <span className="label-text">Image</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={handleFileChange}
            />

            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Preview:</p>
                <img
                  src={imagePreview}
                  alt="preview"
                  className="max-h-48 rounded border"
                />
              </div>
            )}
          </div>

          {/* Author */}
          <div>
            <label className="label">
              <span className="label-text">Author</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full bg-gray-100"
              value={authorName}
              readOnly
            />
          </div>

          {/* Publish Date (for editing) */}
          {isEditing && defaultValues?.publishDate && (
            <div>
              <label className="label">
                <span className="label-text">Publish Date</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full bg-gray-100"
                value={dayjs(defaultValues.publishDate).format(
                  "MMM D, YYYY h:mm A"
                )}
                readOnly
              />
            </div>
          )}

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={close}
              disabled={isSubmitting || isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || isUploading}
            >
              {isUploading ? "Uploading..." : isEditing ? "Update" : "Publish"}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={close}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default BlogModal;
