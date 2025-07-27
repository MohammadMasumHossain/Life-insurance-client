// // src/pages/Dashboard/Customer/Payments/PaymentPage.jsx
// import React from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import { useParams, useSearchParams } from "react-router";
// import useAuth from "../../../../hooks/useAuth";
// import PaymentForm from "./PaymentForm";
// // import useAuth from "../../../../hooks/useAuth";
// // import PaymentForm from "./PaymentForm";

// // Put your publishable key in env: VITE_STRIPE_PK=pk_test_...
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

// const PaymentPage = () => {
//   const { policyId: applicationId } = useParams();   // <-- fix here
//   const [searchParams] = useSearchParams();
//   const { user } = useAuth();

//   const freq = searchParams.get("freq") || "monthly";
//   const amount = Number(searchParams.get("amount") || 0); // USD (not cents)

//   const options = {
//     mode: "payment",
//     currency: "usd",
//     amount: amount * 100, // Stripe expects cents
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-white py-8 px-4 md:px-8">
//       <h1 className="text-2xl font-bold mb-6">Complete Payment</h1>

//       <Elements stripe={stripePromise} options={options}>
//         <PaymentForm
//           user={user}
//           applicationId={applicationId}
//           frequency={freq}
//           amount={amount}
//         />
//       </Elements>
//     </div>
//   );
// };

// export default PaymentPage;

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useParams, useSearchParams } from "react-router";
import useAuth from "../../../../hooks/useAuth";
import PaymentForm from "./PaymentForm";
// import PaymentForm from "../PaymentForm/PaymentForm";

// Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

// BDT -> USD rate (Stripe charges USD)
const BDT_TO_USD = Number(import.meta.env.VITE_BDT_TO_USD || 0.0087); // example rate

const PaymentPage = () => {
  const { policyId: applicationId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const freq = searchParams.get("freq") || "monthly";
  const amountBDT = Number(searchParams.get("amount") || 0);

  // Convert to USD for Stripe
  const amountUSD = Math.round(amountBDT * BDT_TO_USD * 100) / 100;
  const options = {
    mode: "payment",
    currency: "usd",
    amount: Math.round(amountUSD * 100), // cents
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-white py-8 px-4 md:px-8">
      <h1 className="text-2xl font-bold mb-6">Complete Payment</h1>

      <Elements stripe={stripePromise} options={options}>
        <PaymentForm
          user={user}
          applicationId={applicationId}
          frequency={freq}
          amountBDT={amountBDT}
          amountUSD={amountUSD}
        />
      </Elements>
    </div>
  );
};

export default PaymentPage;
