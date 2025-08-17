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
import AdminRoute from "../routes/AdminRoute";
import CustomerRoute from "../routes/CustomerRoute";
import AgentRoute from "../routes/AgentRoute";
import Forbidden from "../pages/Forbideen/Forbideen";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import ErrorPage from "../components/ErrorPage";
import AboutUs from "../pages/AboutUs/AboutUs";
import ProfileCard from "../pages/ProfileCard/ProfileCard";

// import ErrorPage from "../components/ErrorPage";
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
      {
        path: "/aboutus", element:<AboutUs></AboutUs>
      },
      { path: "/policies/:id", element: <PolicyDetails /> },
      {
        path:"/forbidden",
        Component:Forbidden
      },
     {
     path: '*',
     element: <ErrorPage />
      },
      {
        path:'profile',
        element:<ProfileCard></ProfileCard>
      },

      {
        path:'profilepage',
        element:<ProfilePage></ProfilePage>
      },
      
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
      { index: true, element: <DashboardHome /> },
      { path: "mypolicy", element: <CustomerRoute> <MyPolicy /></CustomerRoute>  },
      { path: "payment-status", element:<CustomerRoute> <PaymentStatus /></CustomerRoute>  }, // ✅ Added Payment Status
      { path: "payment/:policyId", element:<CustomerRoute> <PaymentPage /></CustomerRoute>  }, // ✅ Added Payment Page
      { path: "manageApplication", element: <AdminRoute><ManageApplications /></AdminRoute> },
      { path: "manageuser", element: <AdminRoute> <ManageUser /> </AdminRoute>  },
      { path: "managepolicies", element: <AdminRoute> <ManagePolicies /></AdminRoute>  },
      { path: "assignedcustomers", element: <AgentRoute> <AssignedCustomers /></AgentRoute>  },
      { path: "manageblogs", element: <ManageBlogs /> },
      {
        path: "manageblogs", element: <AdminRoute><ManageBlogs></ManageBlogs></AdminRoute>
      },
      {
        path:'profile',
        element:<ProfilePage></ProfilePage>
      },
       
     
      {
        path: "claimrequestpage",
        element: <CustomerRoute><ClaimRequestPage></ClaimRequestPage></CustomerRoute> ,
      },
      {
        path: "policy-clearance",
        element: <AgentRoute> <PolicyClearance /></AgentRoute> ,
      },
      {
        path: "manage-transactions",
        element: <AdminRoute><ManageTransactions /></AdminRoute> ,
      },
    ],
  },
]);
