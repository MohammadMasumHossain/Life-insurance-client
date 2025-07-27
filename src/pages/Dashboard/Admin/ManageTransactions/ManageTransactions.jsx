// src/pages/Dashboard/Admin/ManageTransactions/ManageTransactions.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../../hooks/axiosSecure";

const ManageTransactions = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [email, setEmail] = useState("");

  // fetch paginated payments
  const {
    data: paymentsResp,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["payments", { page, limit, email }],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments", {
        params: { page, limit, email: email || undefined },
      });
      return res.data; // { total, page, limit, data }
    },
    keepPreviousData: true,
  });

  // fetch summary
  const {
    data: summary,
    isLoading: summaryLoading,
  } = useQuery({
    queryKey: ["payments-summary"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments/summary");
      return res.data; // { totalUSD, totalBDT, count }
    },
  });

  const total = paymentsResp?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const txs = paymentsResp?.data ?? [];

  // Fallback client-side totals from current page if summary is missing or zero
  const clientTotalTransactions = txs.length;
  const clientTotalIncomeBDT = txs.reduce((sum, t) => sum + (t.amountBDT || 0), 0);

  if (isLoading) return <div className="p-6">Loading transactions…</div>;
  if (isError) {
    console.error(error);
    return (
      <div className="p-6 text-red-500">
        Failed to load. {error?.message || ""}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-white py-8 px-4 md:px-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Manage Transactions</h1>
      </header>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded bg-white shadow">
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-2xl font-bold">
            {summaryLoading
              ? "…"
              : (summary?.count ?? 0) > 0
              ? summary.count
              : clientTotalTransactions}
          </p>
        </div>

        <div className="p-4 rounded bg-white shadow">
          <p className="text-sm text-gray-500">Total Income (BDT)</p>
          <p className="text-2xl font-bold">
            {summaryLoading
              ? "…"
              : (summary?.totalBDT ?? 0) > 0
              ? summary.totalBDT.toLocaleString()
              : clientTotalIncomeBDT.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded bg-white shadow">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Transaction ID</th>
              <th>Customer Email</th>
              <th>Policy Name</th>
              <th>Amount (BDT)</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {txs.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}

            {txs.map((t, idx) => (
              <tr key={t._id}>
                <td>{(page - 1) * limit + idx + 1}</td>
                <td className="font-mono text-xs">{t.transactionId}</td>
                <td>{t.email}</td>
                <td>{t.policyName || "—"}</td>
                <td>{t.amountBDT?.toLocaleString?.() ?? 0}</td>
                <td>
                  <span
                    className={`badge ${
                      t.status === "succeeded"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="btn btn-sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            className="btn btn-sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageTransactions;
