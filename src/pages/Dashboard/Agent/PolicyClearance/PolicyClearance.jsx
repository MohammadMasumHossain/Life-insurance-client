import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import axiosSecure from "../../../../hooks/axiosSecure";

const PolicyClearance = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // -------- Fetch all claims --------
  const { data: claims = [], isLoading, isError, error } = useQuery({
    queryKey: ["claims"],
    queryFn: async () => {
      const res = await axiosSecure.get("/claims");
      return res.data;
    },
  });

  // -------- Approve claim --------
  const approveMutation = useMutation({
    mutationFn: async (id) =>
      axiosSecure.patch(`/claims/${id}/status`, { status: "Approved" }),
    onSuccess: () => {
      Swal.fire("Approved!", "Claim status updated to Approved.", "success");
      queryClient.invalidateQueries(["claims"]);
      setOpen(false);
      setSelected(null);
    },
    onError: () => {
      Swal.fire("Error", "Failed to approve claim.", "error");
    },
  });

  const onView = (row) => {
    setSelected(row);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const onApprove = async () => {
    if (!selected?._id) return;
    const confirmed = await Swal.fire({
      title: "Approve this claim?",
      text: "This will mark the claim as Approved.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, approve",
    });
    if (confirmed.isConfirmed) {
      approveMutation.mutate(selected._id);
    }
  };

  if (isLoading) return <div className="p-6">Loading claims...</div>;
  if (isError)
    return (
      <div className="p-6 text-red-500">
        Failed to load claims. {error?.message}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-white py-8 px-4 md:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Policy Clearance</h1>
        <p className="text-gray-500">All policy claims submitted by customers.</p>
      </header>

      <div className="overflow-x-auto shadow bg-white rounded">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>Policy Name</th>
              <th>Customer Email</th>
              <th>Coverage Amount</th>
              <th>Submitted</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {claims.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No claims found
                </td>
              </tr>
            )}

            {claims.map((c) => (
              <tr key={c._id} className="hover">
                <td>{c.policyName}</td>
                <td>{c.email}</td>
                <td>
                  {c.coverageAmount
                    ? `৳${Number(c.coverageAmount).toLocaleString()}`
                    : "-"}
                </td>
                <td>
                  {c.createdAt
                    ? new Date(c.createdAt).toLocaleString()
                    : "-"}
                </td>
                <td
                  className={
                    c.status === "Approved"
                      ? "text-green-600"
                      : c.status === "Pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }
                >
                  {c.status}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => onView(c)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-semibold mb-4">
              Claim Details – {selected.policyName}
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Customer Email:</span>{" "}
                {selected.email}
              </p>
              <p>
                <span className="font-semibold">Coverage Amount:</span>{" "}
                {selected.coverageAmount
                  ? `৳${Number(selected.coverageAmount).toLocaleString()}`
                  : "-"}
              </p>
              <p>
                <span className="font-semibold">Reason:</span>{" "}
                {selected.reason || "-"}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {selected.status}
              </p>
              <p>
                <span className="font-semibold">Submitted:</span>{" "}
                {selected.createdAt
                  ? new Date(selected.createdAt).toLocaleString()
                  : "-"}
              </p>
              {selected.filePath && (
                <div className="mt-2">
                  <span className="font-semibold">Attached Document:</span>{" "}
                  <a
                    href={selected.filePath}
                    target="_blank"
                    rel="noreferrer"
                    className="link link-primary"
                  >
                    View / Download
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button className="btn" onClick={onClose}>
                Close
              </button>
              {selected.status !== "Approved" && (
                <button
                  className="btn btn-primary"
                  onClick={onApprove}
                  disabled={approveMutation.isLoading}
                >
                  {approveMutation.isLoading ? "Approving..." : "Approve"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyClearance;
