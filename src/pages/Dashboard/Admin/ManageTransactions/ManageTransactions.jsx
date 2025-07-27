
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../../hooks/axiosSecure";

const ManageTransactions = () => {
  const {
    data: txs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments");
      return res.data;
    },
  });

  const totals = useMemo(() => {
    const success = txs.filter((t) => t.stripeStatus === "succeeded");
    const totalUSD = success.reduce((sum, t) => sum + (Number(t.amountUSD) || 0), 0);
    const totalBDT = success.reduce((sum, t) => sum + (Number(t.amountBDT) || 0), 0);
    return { totalUSD, totalBDT, count: success.length };
  }, [txs]);

  if (isLoading) return <div className="p-6">Loading transactions...</div>;
  if (isError) return <div className="p-6 text-red-500">Failed: {error?.message}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-white py-8 px-4 md:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Manage Transactions</h1>
        <p className="text-gray-500">All Stripe payments made by customers</p>
      </header>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <p className="text-sm text-gray-500">Total Successful Payments</p>
          <p className="text-xl font-bold">{totals.count}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-sm text-gray-500">Total Income (USD)</p>
          <p className="text-xl font-bold">${totals.totalUSD.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-sm text-gray-500">Total Income (BDT)</p>
          <p className="text-xl font-bold">
            ৳{totals.totalBDT.toLocaleString("en-BD")}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow bg-white rounded">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>Transaction ID</th>
              <th>Customer Email</th>
              <th>Policy Name</th>
              <th>Amount (USD)</th>
              <th>Amount (BDT)</th>
              <th>Frequency</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {txs.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  No transactions found
                </td>
              </tr>
            )}

            {txs.map((t) => (
              <tr key={t._id} className="hover">
                <td className="whitespace-pre-wrap">{t.transactionId}</td>
                <td>{t.customerEmail}</td>
                <td>{t.policyName}</td>
                <td>${(Number(t.amountUSD) || 0).toFixed(2)}</td>
                <td>৳{(Number(t.amountBDT) || 0).toLocaleString("en-BD")}</td>
                <td>{t.frequency || "-"}</td>
                <td>
                  {t.createdAt ? new Date(t.createdAt).toLocaleString() : "-"}
                </td>
                <td
                  className={
                    t.stripeStatus === "succeeded"
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {t.stripeStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTransactions;
