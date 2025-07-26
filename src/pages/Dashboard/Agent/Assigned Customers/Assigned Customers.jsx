import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
// <- adjust path
import useAuth from "../../../../hooks/useAuth";
import axiosSecure from "../../../../hooks/axiosSecure";
 // <- adjust path

const STATUS_LIST = ["Pending", "Approved", "Rejected"];

const AssignedCustomers = () => {
  const { user } = useAuth(); // expects user.email
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState(null); // modal

  const {
    data: apps = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["agent-apps", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/agent/applications", {
        params: { email: user.email }, // or agentId if you prefer
      });
      return res.data;
    },
    enabled: !!user?.email,
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) =>
      axiosSecure.patch(`/agent/applications/${id}/status`, { status }),
    onSuccess: () => {
      Swal.fire("Success", "Status updated", "success");
      queryClient.invalidateQueries(["agent-apps", user?.email]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to update status", "error");
    },
  });

  const handleStatusChange = (application, newStatus) => {
    statusMutation.mutate({ id: application._id, status: newStatus });
  };

  if (isLoading) return <div className="p-4">Loading assigned customers...</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load data.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-white py-8 px-4 md:px-8">
      <h1 className="text-2xl font-bold mb-6">Assigned Customers</h1>

      <div className="overflow-x-auto shadow bg-white rounded">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Policy</th>
              <th>Status</th>
              <th>Submitted</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {apps.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No customers assigned to you.
                </td>
              </tr>
            )}

            {apps.map((app) => (
              <tr key={app._id} className="hover">
                <td>{app.fullName}</td>
                <td>{app.email}</td>
                <td>{app.policyTitle || app.policyType || "N/A"}</td>
                <td>
                  <select
                    className="select select-bordered select-sm"
                    value={app.status}
                    onChange={(e) => handleStatusChange(app, e.target.value)}
                  >
                    {STATUS_LIST.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  {app.submittedAt
                    ? new Date(app.submittedAt).toLocaleDateString()
                    : "-"}
                </td>
                <td>
                  <button
                    className="btn btn-xs btn-info text-white"
                    onClick={() => setSelectedApp(app)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded shadow-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {selectedApp.fullName} — Details
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <strong>Email:</strong> {selectedApp.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedApp.phoneNumber}
              </p>
              <p>
                <strong>Address:</strong> {selectedApp.address}
              </p>
              <p>
                <strong>Policy:</strong>{" "}
                {selectedApp.policyTitle || selectedApp.policyType}
              </p>
              <p>
                <strong>Coverage Amount:</strong>{" "}
                {selectedApp.coverageAmount || "-"}
              </p>
              <p>
                <strong>Term Duration:</strong>{" "}
                {selectedApp.termDuration || "-"}
              </p>
              <p>
                <strong>Status:</strong> {selectedApp.status}
              </p>
              <p>
                <strong>NID:</strong> {selectedApp.nid}
              </p>
              <p>
                <strong>Nominee:</strong> {selectedApp.nomineeName} (
                {selectedApp.nomineeRelationship}
                ) — NID: {selectedApp.nomineeNID}
              </p>
              {selectedApp.healthConditions?.length > 0 && (
                <p>
                  <strong>Health Conditions:</strong>{" "}
                  {selectedApp.healthConditions.join(", ")}
                </p>
              )}
              <p>
                <strong>Submitted At:</strong>{" "}
                {selectedApp.submittedAt &&
                  new Date(selectedApp.submittedAt).toLocaleString()}
              </p>
              {selectedApp.assignedAgent && (
                <p>
                  <strong>Assigned Agent:</strong>{" "}
                  {selectedApp.assignedAgent.name} (
                  {selectedApp.assignedAgent.email})
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button className="btn" onClick={() => setSelectedApp(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedCustomers;
