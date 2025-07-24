import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

const API = 'http://localhost:3000';

// ---------- API helpers ----------
const fetchUsers = async (roleFilter) => {
  const url = roleFilter && roleFilter !== 'All'
    ? `${API}/users?role=${roleFilter}`
    : `${API}/users`;
  const { data } = await axios.get(url);
  return data;
};

const updateUserRoleApi = async ({ userId, role }) => {
  return axios.patch(`${API}/users/${userId}/role`, { role });
};

const deleteUserApi = async (userId) => {
  return axios.delete(`${API}/users/${userId}`);
};

const ManageUser = () => {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState('All');

  // ----------- Queries -----------
  const {
    data: users = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['users', roleFilter],
    queryFn: () => fetchUsers(roleFilter),
  });

  // ----------- Mutations -----------
  const updateRoleMutation = useMutation({
    mutationFn: updateUserRoleApi,
    onSuccess: () => {
      Swal.fire('Success', 'Role updated successfully', 'success');
      queryClient.invalidateQueries(['users']);
    },
    onError: (err) => {
      console.error(err);
      Swal.fire('Error', err?.response?.data?.message || 'Failed to update role', 'error');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      Swal.fire('Deleted!', 'User has been removed.', 'success');
      queryClient.invalidateQueries(['users']);
    },
    onError: (err) => {
      console.error(err);
      Swal.fire('Error', err?.response?.data?.message || 'Failed to delete user', 'error');
    },
  });

  // ----------- Handlers -----------
  const promoteToAgent = (user) => {
    updateRoleMutation.mutate({ userId: user._id, role: 'agent' });
  };

  const demoteToCustomer = (user) => {
    updateRoleMutation.mutate({ userId: user._id, role: 'customer' });
  };

  const promoteToAdmin = (user) => {
    updateRoleMutation.mutate({ userId: user._id, role: 'admin' });
  };

  const deleteUser = (user) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete ${user.name} (${user.email})? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUserMutation.mutate(user._id);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-white py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-3xl font-bold text-slate-800">Manage Users</h2>

        {/* Role Filter */}
          <div className="flex items-center gap-2">
            <label className="font-medium text-slate-600">Filter by role:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="select select-bordered select-sm w-40"
            >
              <option>All</option>
              <option>customer</option>
              <option>agent</option>
              <option>admin</option>
            </select>
          </div>

          {(isFetching || updateRoleMutation.isPending || deleteUserMutation.isPending) && (
            <span className="loading loading-spinner loading-sm text-primary"></span>
          )}
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-slate-100 p-4">
          {isLoading ? (
            <div className="py-10 text-center">Loading users...</div>
          ) : (
            <table className="table w-full text-sm">
              <thead className="bg-blue-100 text-blue-900">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered</th>
                  <th className="min-w-[260px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u._id} className="hover:bg-blue-50/50 transition">
                    <td>{idx + 1}</td>
                    <td className="font-medium">{u.name || 'N/A'}</td>
                    <td className="whitespace-nowrap">{u.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === 'admin'
                            ? 'badge-error'
                            : u.role === 'agent'
                            ? 'badge-info'
                            : 'badge-ghost'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </td>

                    <td className="min-w-[260px]">
                      <div className="flex flex-wrap gap-2">
                        {u.role !== 'agent' && (
                          <button
                            className="btn btn-xs btn-success"
                            onClick={() => promoteToAgent(u)}
                          >
                            Make Agent
                          </button>
                        )}

                        {u.role === 'agent' && (
                          <button
                            className="btn btn-xs btn-warning text-white"
                            onClick={() => demoteToCustomer(u)}
                          >
                            Make Customer
                          </button>
                        )}

                        {u.role !== 'admin' && (
                          <button
                            className="btn btn-xs btn-primary"
                            onClick={() => promoteToAdmin(u)}
                          >
                            Make Admin
                          </button>
                        )}

                        {/* Optional Delete */}
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => deleteUser(u)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!users.length && (
                  <tr>
                    <td colSpan="6">
                      <div className="text-center py-10 text-gray-500">
                        No users found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
