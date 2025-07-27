
// import React, { useState, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router";
// import useAuth from "../../../../hooks/useAuth";
// import axiosSecure from "../../../../hooks/axiosSecure";


// // Very simple example premium calculator (replace with your real logic)
// function calcPremium({ coverageAmount, termDuration, frequency }) {
//   // termDuration is like "15 years" -> extract years
//   const years = Number(termDuration?.match(/\d+/)?.[0] ?? 1);
//   const baseYearly = (coverageAmount || 0) * 0.01 / years; // <- demo math only
//   if (frequency === "yearly") return Math.round(baseYearly);
//   return Math.round(baseYearly / 12); // monthly
// }

// const PaymentStatus = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [selectedFreq, setSelectedFreq] = useState({}); // { [applicationId]: 'monthly' | 'yearly' }

//   const { data: apps = [], isLoading, isError } = useQuery({
//     queryKey: ["my-applications", user?.email],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/applications", {
//         params: { email: user.email },
//       });
//       return res.data;
//     },
//     enabled: !!user?.email,
//   });

//   const approved = useMemo(
//     () => apps.filter((a) => a.status === "Approved"),
//     [apps]
//   );

//   if (isLoading) return <div className="p-4">Loading payment status...</div>;
//   if (isError) return <div className="p-4 text-red-500">Failed to load data.</div>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-white py-8 px-4 md:px-8">
//       <h1 className="text-2xl font-bold mb-6">Payment Status</h1>

//       <div className="overflow-x-auto shadow bg-white rounded">
//         <table className="table w-full">
//           <thead className="bg-gray-100">
//             <tr>
//               <th>Policy</th>
//               <th>Coverage</th>
//               <th>Term</th>
//               <th>Frequency</th>
//               <th>Premium</th>
//               <th>Status</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {approved.length === 0 && (
//               <tr>
//                 <td colSpan={7} className="text-center py-6">
//                   No approved policies found.
//                 </td>
//               </tr>
//             )}

//             {approved.map((app) => {
//               const frequency = selectedFreq[app._id] || "monthly";
//               const premium = calcPremium({
//                 coverageAmount: app.coverageAmount,
//                 termDuration: app.termDuration,
//                 frequency,
//               });

//               const isPaid = app.paymentStatus === "Paid";

//               return (
//                 <tr key={app._id} className="hover">
//                   <td>{app.policyTitle || app.policyType}</td>
//                   <td>{app.coverageAmount?.toLocaleString()}</td>
//                   <td>{app.termDuration}</td>
//                   <td>
//                     <select
//                       className="select select-bordered select-sm"
//                       value={frequency}
//                       disabled={isPaid}
//                       onChange={(e) =>
//                         setSelectedFreq((s) => ({
//                           ...s,
//                           [app._id]: e.target.value,
//                         }))
//                       }
//                     >
//                       <option value="monthly">Monthly</option>
//                       <option value="yearly">Yearly</option>
//                     </select>
//                   </td>
//                   <td>
//                     {premium} USD
//                   </td>
//                   <td className={isPaid ? "text-green-600" : "text-red-500"}>
//                     {isPaid ? "Paid" : "Due"}
//                   </td>
//                   <td>
//                     {!isPaid && (
//                       <button
//                         className="btn btn-sm btn-primary"
//                         onClick={() =>
//                           navigate(`/dashboard/payment/${app._id}?freq=${frequency}&amount=${premium}`)
//                         }
//                       >
//                         Pay
//                       </button>
//                     )}
//                     {isPaid && (
//                       <span className="badge badge-success">Completed</span>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PaymentStatus;


import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAuth from "../../../../hooks/useAuth"; // <-- adjust path
import axiosSecure from "../../../../hooks/axiosSecure"; // <-- adjust path

// ---------- helpers ----------
const formatBDT = (amount) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

const getYears = (termDuration) => {
  // expects strings like "15 years" or "2 year"
  const y = Number(termDuration?.match(/\d+/)?.[0]);
  return Number.isFinite(y) && y > 0 ? y : 1;
};

// Monthly = coverageAmount / (years * 12)
// Yearly  = coverageAmount / years
const calcPremiumBDT = ({ coverageAmount = 0, termDuration, frequency }) => {
  const years = getYears(termDuration);
  if (frequency === "yearly") {
    return Math.round(coverageAmount / years);
  }
  const months = years * 12;
  return Math.round(coverageAmount / months);
};
// ---------- /helpers ----------

const PaymentStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedFreq, setSelectedFreq] = useState({}); // { [applicationId]: 'monthly' | 'yearly' }

  const { data: apps = [], isLoading, isError } = useQuery({
    queryKey: ["my-applications", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/applications", {
        params: { email: user.email },
      });
      return res.data;
    },
    enabled: !!user?.email,
  });

  const approved = useMemo(
    () => apps.filter((a) => a.status === "Approved"),
    [apps]
  );

  if (isLoading) return <div className="p-4">Loading payment status...</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load data.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-white py-8 px-4 md:px-8">
      <h1 className="text-2xl font-bold mb-6">Payment Status</h1>

      <div className="overflow-x-auto shadow bg-white rounded">
        <table className="table w-full">
          <thead className="bg-gray-100">
          <tr>
            <th>Policy</th>
            <th>Coverage</th>
            <th>Term</th>
            <th>Frequency</th>
            <th>Premium (BDT)</th>
            <th>Status</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          {approved.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-6">
                No approved policies found.
              </td>
            </tr>
          )}

          {approved.map((app) => {
            const frequency = selectedFreq[app._id] || "monthly";
            const premiumBDT = calcPremiumBDT({
              coverageAmount: app.coverageAmount,
              termDuration: app.termDuration,
              frequency,
            });

            const isPaid = app.paymentStatus === "Paid";

            return (
              <tr key={app._id} className="hover">
                <td>{app.policyTitle || app.policyType}</td>
                <td>{formatBDT(app.coverageAmount || 0)}</td>
                <td>{app.termDuration}</td>
                <td>
                  <select
                    className="select select-bordered select-sm"
                    value={frequency}
                    disabled={isPaid}
                    onChange={(e) =>
                      setSelectedFreq((s) => ({
                        ...s,
                        [app._id]: e.target.value,
                      }))
                    }
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </td>
                <td>{formatBDT(premiumBDT)}</td>
                <td className={isPaid ? "text-green-600" : "text-red-500"}>
                  {isPaid ? "Paid" : "Due"}
                </td>
                <td>
                  {!isPaid && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() =>
                        navigate(
                          `/dashboard/payment/${app._id}?freq=${frequency}&amount=${premiumBDT}`
                        )
                      }
                    >
                      Pay
                    </button>
                  )}
                  {isPaid && (
                    <span className="badge badge-success">Completed</span>
                  )}
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentStatus;
