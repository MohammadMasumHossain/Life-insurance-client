import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import axiosSecure from "../../hooks/axiosSecure";

const ProfilePage = () => {
  const { user } = useAuth();
  const { role } = useUserRole();

  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(null); // image file
  const [nid, setNid] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [address, setAddress] = useState("");

  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data?.data?.url;
  };

  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosSecure.patch(`/users/${user?.email}`, payload);
      return data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Profile updated", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to update profile", "error");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let photoURL = user?.photoURL;
    if (photo instanceof File) {
      photoURL = await uploadImageToImgbb(photo);
    }

    const payload = {
      name,
      photo: photoURL,
      nid,
      fatherName,
      motherName,
      address,
    };

    updateMutation.mutate(payload);
  };

  const getBadgeColor = () => {
    if (role === "admin") return "badge-error";
    if (role === "agent") return "badge-primary";
    return "badge-success";
  };

  return (
    <>
      {/* Full-screen loading spinner while updating */}
      {updateMutation.isPending && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-60 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-10">
        <div className="max-w-2xl mx-auto p-6 space-y-6 bg-white shadow-lg rounded">
          <h2 className="text-2xl font-bold text-center">User Profile</h2>

          <div className="flex items-center gap-4">
            <img
              src={
                photo
                  ? URL.createObjectURL(photo)
                  : user?.photoURL || "https://i.ibb.co/ZYW3VTp/brown-brim.png"
              }
              alt="User"
              className="w-20 h-20 rounded-full object-cover border"
            />
            <div>
              <h3 className="text-xl font-semibold">{name || "No Name Set"}</h3>
              <span className={`badge ${getBadgeColor()}`}>{role}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-medium">Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>

            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                value={user?.email}
                disabled
              />
            </div>

            <div>
              <label className="block font-medium">Last Login</label>
              <input
                type="text"
                className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                value={user?.metadata?.lastSignInTime || "N/A"}
                disabled
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">NID</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium">Father's Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium">Mother's Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium">Address</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full flex justify-center"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Save Profile"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
