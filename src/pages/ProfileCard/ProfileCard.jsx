import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import axiosSecure from "../../hooks/axiosSecure";

const ProfileCard = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    photo: "",
    nid: "",
    fatherName: "",
    motherName: "",
    address: "",
  });

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/users/${user.email}`)
        .then(res => {
          setProfile({
            name: res.data.name || user.displayName || "",
            photo: res.data.photo || user.photoURL || "",
            nid: res.data.nid || "",
            fatherName: res.data.fatherName || "",
            motherName: res.data.motherName || "",
            address: res.data.address || "",
          });
        })
        .catch(err => console.error(err));
    }
  }, [user?.email]);

  const getBadgeColor = () => {
    if (role === "admin") return "badge-error";
    if (role === "agent") return "badge-primary";
    return "badge-success";
  };

  return (
    <div className="max-w-xl mt-20 mb-20 mx-auto p-6 bg-gray-50 rounded-lg shadow-lg space-y-4">
      <div className="flex items-center gap-4">
        <img
          src={profile.photo || "https://i.ibb.co/ZYW3VTp/brown-brim.png"}
          alt="User"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-semibold">{profile.name || "No Name"}</h2>
          <span className={`badge ${getBadgeColor()}`}>{role}</span>
        </div>
      </div>

      <div className="space-y-2">
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Address:</strong> {profile.address || "N/A"}</p>
        <p><strong>Father's Name:</strong> {profile.fatherName || "N/A"}</p>
        <p><strong>Mother's Name:</strong> {profile.motherName || "N/A"}</p>
        <p><strong>NID:</strong> {profile.nid || "N/A"}</p>
      </div>

      <button
        className="btn btn-primary w-full"
        onClick={() => navigate("/profilepage")}
      >
        Update Profile
      </button>
    </div>
  );
};

export default ProfileCard;
