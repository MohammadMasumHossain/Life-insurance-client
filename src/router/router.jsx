import { createBrowserRouter } from "react-router"; // ✅ Make sure it's `react-router-dom`

import Home from "../pages/Home/Home/Home";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/register";
import AllPolicies from "../pages/AllPolicies/AllPolicies";
import Blog from "../pages/Blog/Blog";
import DashBoard from "../pages/DashBoard/DashBoard";
import PolicyDetails from "../components/PoliciesDetails/PolicyDetails";
import QuotePage from "../components/PoliciesDetails/QuotePage";
import ApplicationForm from "../components/ApplicationForm";
import PrivateRoute from "../routes/PrivateRoute";


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
        path:'/Dashboard',
        element:<DashBoard></DashBoard>
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
]);
