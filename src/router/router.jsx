import { createBrowserRouter } from "react-router"; // ✅ Make sure it's `react-router-dom`

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


export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path:'/blog',
        element:<Blog></Blog>
      },
      {
        path:'/AllPolicies',
        element:<AllPolicies></AllPolicies>
      },
      {
        path:'/policies/:id',
        element:<PolicyDetails></PolicyDetails>
      },
     
      {
        path:'/quote',
        element:<PrivateRoute><QuotePage></QuotePage></PrivateRoute>
      },
      {
        path:'/application',
        element:<PrivateRoute><ApplicationForm></ApplicationForm></PrivateRoute>
      }
    ],
  },

 
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },


   {
    path:"/dashboard",
    element:<PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    children: [
      {
        path:"mypolicy",
        element:<MyPolicy></MyPolicy>
      },
      {
        path:"manageApplication",
        element:<ManageApplications></ManageApplications>
      },
      {
        path:"manageuser",
        element:<ManageUser></ManageUser>
      }, 
      {
         path:"managepolicies",
         element:<ManagePolicies></ManagePolicies>
      },
      {
        path:"assignedcustomers",
        element:<AssignedCustomers></AssignedCustomers>
      }
    ]
  }
]);
