// src/pages/Dashboard/Customer/ClaimRequest/ClaimRequestPage.jsx
import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth";
import axiosSecure from "../../../../hooks/axiosSecure";

const ClaimRequestPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);

  // 1) Fetch approved applications for this user
  const { data: apps = [], isLoading: appsLoading } = useQuery({
    queryKey: ["my-applications", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/applications", {
        params: { email: user.email },
      });
      return res.data;
    },
    enabled: !!user?.email,
  });

  const approvedApps = useMemo(
    () => apps.filter((a) => a.status === "Approved"),
    [apps]
  );

  // 2) Fetch existing claims of this user
  const { data: claims = [], isLoading: claimsLoading } = useQuery({
    queryKey: ["my-claims", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/claims", {
        params: { email: user.email },
      });
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Map claims by applicationId for quick lookup
  const claimByAppId = useMemo(() => {
    const m = {};
    for (const c of claims) {
      m[c.applicationId] = c;
    }
    return m;
  }, [claims]);

  const createClaimMutation = useMutation({
    mutationFn: async (formData) =>
      axiosSecure.post("/claims", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-claims", user?.email] });
      closeModal();
    },
  });

  const openModal = (app) => {
    setSelectedApp(app);
    setReason("");
    setFile(null);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedApp(null);
    setReason("");
    setFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    const fd = new FormData();
    fd.append("applicationId", selectedApp._id);
    fd.append("policyName", selectedApp.policyTitle || selectedApp.policyType);
    fd.append("email", user.email);
    fd.append("reason", reason);
    if (file) fd.append("file", file);

    createClaimMutation.mutate(fd);
  };

  if (appsLoading || claimsLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-white py-8 px-4 md:px-8">
      <h1 className="text-2xl font-bold mb-6">Claim Request</h1>

      <div className="overflow-x-auto shadow bg-white rounded">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>Policy Name</th>
              <th>Coverage</th>
              <th>Term</th>
              <th>Claim Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {approvedApps.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6">
                  You have no approved policies to claim.
                </td>
              </tr>
            )}

            {approvedApps.map((app) => {
              const existingClaim = claimByAppId[app._id?.toString()] || null; // backend returns ObjectId for applicationId; careful if comparing strings
              const status = existingClaim?.status || "-";
              const canClaim =
                !existingClaim || existingClaim.status === "Rejected"; // only allow if no claim or last one rejected

              return (
                <tr key={app._id}>
                  <td>{app.policyTitle || app.policyType}</td>
                  <td>{app.coverageAmount?.toLocaleString("en-BD")}</td>
                  <td>{app.termDuration}</td>
                  <td>
                    {existingClaim ? (
                      <span
                        className={
                          status === "Approved"
                            ? "text-green-600"
                            : status === "Pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {status}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      disabled={!canClaim}
                      onClick={() => openModal(app)}
                    >
                      {canClaim ? "Claim" : "Claimed"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Submit Claim</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Policy Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={selectedApp.policyTitle || selectedApp.policyType}
                  readOnly
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Reason for claim</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  rows={4}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Describe why you're claiming..."
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Document Upload (PDF/Image)
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button type="button" className="btn" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createClaimMutation.isLoading}
                >
                  {createClaimMutation.isLoading ? "Submitting..." : "Submit Claim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimRequestPage;
