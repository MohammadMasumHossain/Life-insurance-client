// src/pages/Admin/ManageApplications/ManageApplications.jsx
import React, { useMemo, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEye } from 'react-icons/fa';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

const API = 'https://life-insurance-server-three.vercel.app';

const statusColors = {
  Pending: 'bg-yellow-500',
  Approved: 'bg-green-500',
  Rejected: 'bg-red-500',
};

// ---- API helpers ----
const fetchApplications = async () => {
  const { data } = await axios.get(`${API}/applications`);
  return data;
};

const fetchAgents = async () => {
  const { data } = await axios.get(`${API}/users?role=agent`);
  return data;
};

// <-- we will now send agentId + agentName + agentEmail
const assignAgentApi = async ({ applicationId, agentId, agentName, agentEmail }) => {
  return axios.patch(`${API}/applications/${applicationId}/assign-agent`, {
    agentId,
    agentName,
    agentEmail,
  });
};

const changeStatusApi = async ({ applicationId, status, rejectionFeedback }) => {
  return axios.patch(`${API}/applications/${applicationId}/status`, { status, rejectionFeedback });
};

const ManageApplications = () => {
  const queryClient = useQueryClient();

  const [agentSelect, setAgentSelect] = useState({}); // { [applicationId]: agentId }

  // New states for rejection modal
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [rejectionApp, setRejectionApp] = useState(null);

  // Queries
  const {
    data: applications = [],
    isLoading: isAppsLoading,
    isFetching: isAppsFetching,
  } = useQuery({
    queryKey: ['applications'],
    queryFn: fetchApplications,
  });

  const {
    data: agents = [],
    isLoading: isAgentsLoading,
  } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  });

  // Build a map to easily lookup agent by _id
  const agentMap = useMemo(() => {
    const map = {};
    agents.forEach(a => (map[a._id] = a));
    return map;
  }, [agents]);

  // Mutations
  const assignAgentMutation = useMutation({
    mutationFn: assignAgentApi,
    onSuccess: () => {
      Swal.fire('Success', 'Agent assigned successfully', 'success');
      queryClient.invalidateQueries(['applications']);
    },
    onError: (err) => {
      console.error(err);
      Swal.fire('Error', err?.response?.data?.message || 'Failed to assign agent', 'error');
    },
  });

  const changeStatusMutation = useMutation({
    mutationFn: changeStatusApi,
    onSuccess: (_, variables) => {
      Swal.fire('Success', `Status changed to ${variables.status}`, 'success');
      queryClient.invalidateQueries(['applications']);
    },
    onError: () => Swal.fire('Error', 'Failed to update status', 'error'),
  });

  // Handle Assign Agent button click
  const handleAssignAgent = (application) => {
    const agentId = agentSelect[application._id];
    if (!agentId) return Swal.fire('Warning', 'Please select an agent first', 'warning');

    const chosen = agentMap[agentId];
    if (!chosen) return Swal.fire('Error', 'Selected agent not found in list', 'error');

    assignAgentMutation.mutate({
      applicationId: application._id,
      agentId,
      agentName: chosen.name,
      agentEmail: chosen.email,
    });
  };

  // Handle status change: open modal if rejecting, else update immediately
  const handleChangeStatus = (application, nextStatus) => {
    if (nextStatus === 'Rejected') {
      setRejectionApp(application);
      setRejectionFeedback(application.rejectionFeedback || '');
      setRejectionModalOpen(true);
    } else {
      changeStatusMutation.mutate({
        applicationId: application._id,
        status: nextStatus,
      });
    }
  };

  // Submit rejection feedback + status
  const handleRejectSubmit = () => {
    if (!rejectionFeedback.trim()) {
      return Swal.fire('Warning', 'Please provide feedback for rejection', 'warning');
    }

    changeStatusMutation.mutate(
      {
        applicationId: rejectionApp._id,
        status: 'Rejected',
        rejectionFeedback,
      },
      {
        onSuccess: () => {
          setRejectionModalOpen(false);
          setRejectionApp(null);
          setRejectionFeedback('');
        },
      }
    );
  };

  // View application details with rejection feedback shown
  const viewDetails = (app) => {
    const hc =
      app.healthConditions && app.healthConditions.length
        ? app.healthConditions.join(', ')
        : 'None';

    Swal.fire({
      title: `Application Details`,
      width: 700,
      html: `
        <div style="text-align:left">
          <h3><b>Applicant Info</b></h3>
          <p><b>Name:</b> ${app.fullName || 'N/A'}</p>
          <p><b>Email:</b> ${app.email || 'N/A'}</p>
          <p><b>Address:</b> ${app.address || 'N/A'}</p>
          <p><b>Phone:</b> ${app.phoneNumber || 'N/A'}</p>
          <p><b>Date of Birth:</b> ${
            app.dateOfBirth ? new Date(app.dateOfBirth).toLocaleDateString() : 'N/A'
          }</p>
          <p><b>NID:</b> ${app.nid || 'N/A'}</p>

          <hr />

          <h3><b>Nominee Info</b></h3>
          <p><b>Name:</b> ${app.nomineeName || 'N/A'}</p>
          <p><b>Relationship:</b> ${app.nomineeRelationship || 'N/A'}</p>
          <p><b>NID:</b> ${app.nomineeNID || 'N/A'}</p>

          <hr />

          <h3><b>Health Conditions</b></h3>
          <p>${hc}</p>

          <hr />

          <h3><b>Policy Details</b></h3>
          <p><b>Policy Type / Name:</b> ${app.policyType || 'N/A'}</p>
          <p><b>Coverage Amount:</b> ${app.coverageAmount?.toLocaleString() || 'N/A'} ৳</p>
          <p><b>Term Duration:</b> ${app.termDuration || 'N/A'}</p>

          <hr />

          <h3><b>System</b></h3>
          <p><b>Status:</b> ${app.status || 'N/A'}</p>
          <p><b>Submitted At:</b> ${
            app.submittedAt ? new Date(app.submittedAt).toLocaleString() : 'N/A'
          }</p>
          <p><b>Assigned Agent:</b> ${app.assignedAgent?.name || 'Not Assigned'}</p>
          <p><b>Rejection Feedback:</b> ${app.rejectionFeedback || 'None'}</p>
        </div>
      `,
      confirmButtonText: 'Close',
    });
  };

  const loading = isAppsLoading || isAgentsLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-white py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-3xl font-bold text-slate-800">Manage Applications</h2>
          {(isAppsFetching || assignAgentMutation.isLoading || changeStatusMutation.isLoading) && (
            <span className="loading loading-spinner loading-sm text-primary"></span>
          )}
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-slate-100 p-4">
          {loading ? (
            <div className="py-10 text-center">Loading applications...</div>
          ) : (
            <table className="table w-full text-sm">
              <thead className="bg-blue-100 text-blue-900">
                <tr>
                  <th>#</th>
                  <th>Applicant</th>
                  <th>Email</th>
                  <th>Policy Name</th>
                  <th>Application Date</th>
                  <th>Status</th>
                  <th>Assign Agent</th>
                  <th className="min-w-[260px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, idx) => (
                  <tr key={app._id} className="hover:bg-blue-50/50 transition">
                    <td>{idx + 1}</td>
                    <td className="font-medium">{app.fullName}</td>
                    <td className="whitespace-nowrap">{app.email}</td>
                    <td>{app.policyType || 'N/A'}</td>
                    <td>
                      {app.submittedAt
                        ? new Date(app.submittedAt).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-white text-xs font-semibold ${statusColors[app.status]}`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 max-w-[220px]">
                        <select
                          className="select select-bordered select-sm flex-grow"
                          value={agentSelect[app._id] || ''}
                          onChange={(e) =>
                            setAgentSelect((prev) => ({
                              ...prev,
                              [app._id]: e.target.value,
                            }))
                          }
                          disabled={app.status !== 'Pending'}
                        >
                          <option value="">Select Agent</option>
                          {agents.map((agent) => (
                            <option key={agent._id} value={agent._id}>
                              {agent.name}
                            </option>
                          ))}
                        </select>
                        <button
                          className="btn btn-sm btn-primary whitespace-nowrap"
                          onClick={() => handleAssignAgent(app)}
                          disabled={
                            !agentSelect[app._id] || app.status !== 'Pending' || assignAgentMutation.isLoading
                          }
                        >
                          Assign
                        </button>
                      </div>
                    </td>
                    <td className="flex flex-wrap gap-2">
                      <button
                        title="View Details"
                        className="btn btn-sm btn-info"
                        onClick={() => viewDetails(app)}
                      >
                        <FaEye />
                      </button>

                      {/* Status buttons */}
                      {app.status === 'Pending' && (
                        <>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleChangeStatus(app, 'Approved')}
                            disabled={changeStatusMutation.isLoading}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => handleChangeStatus(app, 'Rejected')}
                            disabled={changeStatusMutation.isLoading}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {app.status === 'Approved' && (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleChangeStatus(app, 'Pending')}
                          disabled={changeStatusMutation.isLoading}
                        >
                          Mark Pending
                        </button>
                      )}
                      {app.status === 'Rejected' && (
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleChangeStatus(app, 'Pending')}
                          disabled={changeStatusMutation.isLoading}
                        >
                          Mark Pending
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-500">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Rejection Feedback Modal */}
      {rejectionModalOpen && (
        <div className="fixed inset-0 bg-sky-50 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-gray-100 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-4">Reject Application</h3>
            <p className="mb-2">Please provide feedback for the rejection:</p>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              rows={5}
              value={rejectionFeedback}
              onChange={(e) => setRejectionFeedback(e.target.value)}
              placeholder="Enter rejection feedback here..."
              disabled={changeStatusMutation.isLoading}
            />
            <div className="flex justify-end gap-2">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setRejectionModalOpen(false)}
                disabled={changeStatusMutation.isLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={handleRejectSubmit}
                disabled={changeStatusMutation.isLoading}
              >
                {changeStatusMutation.isLoading ? 'Submitting...' : 'Submit Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplications;
