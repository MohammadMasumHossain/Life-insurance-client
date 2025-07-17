import { createBrowserRouter } from "react-router"; // use react-router-dom, not just react-router

import Home from "../pages/Home/Home/Home";
import RootLayout from "../layouts/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // ✅ JSX goes in `element`
    children: [
      {
        index: true,
        element: <Home />, // ✅ JSX here too
      },
    ],
  },
]);
