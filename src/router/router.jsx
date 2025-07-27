import { createBrowserRouter } from "react-router"; // ✅ Corrected import

import Home from "../pages/Home/Home/Home";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/register";
import AllPolicies from "../pages/AllPolicies/AllPolicies";
import Blog from "../pages/Blog/Blog";

import PolicyDetails from "../components/PoliciesDetails/PolicyDetails";
import QuotePage from "../components/PoliciesDetails/QuotePage";
import ApplicationForm from "../components/ApplicationForm";
import PrivateRoute from "../routes/PrivateRoute";
import MyPolicy from "../pages/Dashboard/Customer/MyPolicy/MyPolicy";
import ManageApplications from "../pages/Dashboard/Admin/ManageApplications/ManageApplications";
import ManageUser from "../pages/Dashboard/Admin/ManageUser/ManageUser";
import ManagePolicies from "../pages/Dashboard/Admin/ManagePolicies/ManagePolicies";
import AssignedCustomers from "../pages/Dashboard/Agent/Assigned Customers/Assigned Customers";
import ManageBlogs from "../pages/Dashboard/Agent/ManageBlogs/ManageBlogs";
import PaymentPage from "../pages/Dashboard/Customer/PaymentPage/PaymentPage";
import PaymentStatus from "../pages/Dashboard/Customer/PaymentStatus/PaymentStatus";
import ClaimRequestPage from "../pages/Dashboard/Customer/ClaimRequestPage/ClaimRequestPage";
import PolicyClearance from "../pages/Dashboard/Agent/PolicyClearance/PolicyClearance";
import ManageTransactions from "../pages/Dashboard/Admin/ManageTransactions/ManageTransactions";
// import PaymentStatus from "../pages/Dashboard/Customer/PaymentStatus/PaymentStatus";
// import PaymentPage from "../pages/Dashboard/Customer/PaymentPage/PaymentPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/blog", element: <Blog /> },
      { path: "/AllPolicies", element: <AllPolicies /> },
      { path: "/policies/:id", element: <PolicyDetails /> },
      {
        path: "/quote",
        element: (
          <PrivateRoute>
            <QuotePage />
          </PrivateRoute>
        ),
      },
      {
        path: "/application",
        element: (
          <PrivateRoute>
            <ApplicationForm />
          </PrivateRoute>
        ),
      },
    ],
  },

  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "mypolicy", element: <MyPolicy /> },
      { path: "payment-status", element: <PaymentStatus /> }, // ✅ Added Payment Status
      { path: "payment/:policyId", element: <PaymentPage /> }, // ✅ Added Payment Page
      { path: "manageApplication", element: <ManageApplications /> },
      { path: "manageuser", element: <ManageUser /> },
      { path: "managepolicies", element: <ManagePolicies /> },
      { path: "assignedcustomers", element: <AssignedCustomers /> },
      { path: "manageblogs", element: <ManageBlogs /> },
      {
        path:"claimrequestpage",
        element:<ClaimRequestPage></ClaimRequestPage>
      },
      {
         path: "policy-clearance",
         element: <PolicyClearance />
      },
      {
         path: "manage-transactions",
         element: <ManageTransactions />
      }
    ],
  },
]);
