// // src/pages/Dashboard/Customer/Payments/PaymentForm.jsx
// import React, { useState } from "react";
// import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
// import { useMutation } from "@tanstack/react-query";
// import { useNavigate } from "react-router";
// import axiosSecure from "../../../../hooks/axiosSecure";
// // import axiosSecure from "../../../../hooks/axiosSecure";

// const PaymentForm = ({ user, applicationId, frequency, amount }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();

//   const [error, setError] = useState("");
//   const [processing, setProcessing] = useState(false);

//   // 1) create PaymentIntent
//   const createIntentMutation = useMutation({
//     mutationFn: async (payload) => {
//       const res = await axiosSecure.post("/payments/create-intent", payload);
//       return res.data; // { clientSecret }
//     },
//   });

//   // 2) confirm payment & update DB
//   const confirmMutation = useMutation({
//     mutationFn: async (payload) => {
//       const res = await axiosSecure.post("/payments/confirm", payload);
//       return res.data;
//     },
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     if (!stripe || !elements) return;

//     try {
//       setProcessing(true);

//       // 1) Ask backend for a PaymentIntent
//       const { clientSecret } = await createIntentMutation.mutateAsync({
//         applicationId,
//         amount: amount * 100, // cents
//         currency: "usd",
//         // you can also send policy info if needed
//       });

//       // 2) Confirm card payment
//       const card = elements.getElement(CardElement);
//       const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(
//         clientSecret,
//         {
//           payment_method: {
//             card,
//             billing_details: {
//               email: user?.email,
//               name: user?.displayName || "Customer",
//             },
//           },
//         }
//       );

//       if (stripeError) {
//         setError(stripeError.message || "Payment failed");
//         setProcessing(false);
//         return;
//       }

//       if (paymentIntent.status === "succeeded") {
//         // 3) let backend mark the policy paid / activate
//         await confirmMutation.mutateAsync({
//           applicationId,
//           amount,
//           frequency,
//           paymentIntentId: paymentIntent.id,
//           status: "Paid",
//         });

//         // Go back to payment status or show success
//         navigate("/dashboard/payment-status", {
//           state: { success: true },
//           replace: true,
//         });
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Payment failed. Please try again.");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-lg mx-auto bg-white rounded shadow p-6 space-y-4"
//     >
//       <div>
//         <p className="mb-1 font-semibold">Payer</p>
//         <p>{user?.email}</p>
//       </div>

//       <div>
//         <p className="mb-1 font-semibold">Policy Application</p>
//         <p>#{applicationId}</p>
//       </div>

//       <div>
//         <p className="mb-1 font-semibold">Frequency</p>
//         <p>{frequency}</p>
//       </div>

//       <div>
//         <p className="mb-1 font-semibold">Amount</p>
//         <p>{amount} USD</p>
//       </div>

//       <div className="mt-4">
//         <label className="block font-semibold mb-2">Card Details</label>
//         <div className="border rounded p-3">
//           <CardElement
//             options={{
//               style: {
//                 base: {
//                   fontSize: "16px",
//                   color: "#424770",
//                   "::placeholder": {
//                     color: "#aab7c4",
//                   },
//                 },
//                 invalid: {
//                   color: "#9e2146",
//                 },
//               },
//             }}
//           />
//         </div>
//       </div>

//       {error && <p className="text-red-500 text-sm">{error}</p>}

//       <button
//         type="submit"
//         className="btn btn-primary w-full"
//         disabled={!stripe || processing}
//       >
//         {processing ? "Processing..." : "Pay Now"}
//       </button>
//     </form>
//   );
// };

// export default PaymentForm;
import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import axiosSecure from "../../../../hooks/axiosSecure";

const formatBDT = (amount) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

const PaymentForm = ({ user, applicationId, frequency, amountBDT, amountUSD }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  // 1) create PaymentIntent
  const createIntentMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosSecure.post("/payments/create-intent", payload);
      return res.data; // { clientSecret }
    },
  });

  // 2) confirm payment & update DB
  const confirmMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosSecure.post("/payments/confirm", payload);
      return res.data;
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!stripe || !elements) return;

    try {
      setProcessing(true);

      // 1) Ask backend for a PaymentIntent (USD cents)
      const { clientSecret } = await createIntentMutation.mutateAsync({
        applicationId,
        amountBDT,
        amountUSD,
        currency: "usd",
        amountUsdCents: Math.round(amountUSD * 100),
      });

      // 2) Confirm card payment
      const card = elements.getElement(CardElement);
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card,
            billing_details: {
              email: user?.email,
              name: user?.displayName || "Customer",
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // 3) update DB -> mark Paid / activate
        await confirmMutation.mutateAsync({
          applicationId,
          amountBDT,
          amountUSD,
          frequency,
          paymentIntentId: paymentIntent.id,
          status: "Paid",
        });

        navigate("/dashboard/payment-status", {
          state: { success: true },
          replace: true,
        });
      }
    } catch (err) {
      console.error(err);
      setError("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white rounded shadow p-6 space-y-4"
    >
      <div>
        <p className="mb-1 font-semibold">Payer</p>
        <p>{user?.email}</p>
      </div>

      <div>
        <p className="mb-1 font-semibold">Policy Application</p>
        <p>#{applicationId}</p>
      </div>

      <div>
        <p className="mb-1 font-semibold">Frequency</p>
        <p>{frequency}</p>
      </div>

      <div>
        <p className="mb-1 font-semibold">Amount</p>
        <p>
          {formatBDT(amountBDT)} (≈ ${amountUSD} USD will be charged via Stripe)
        </p>
      </div>

      <div className="mt-4">
        <label className="block font-semibold mb-2">Card Details</label>
        <div className="border rounded p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={!stripe || processing}
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default PaymentForm;
