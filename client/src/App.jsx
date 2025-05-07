import HomePage from "./routes/homePage/homePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import { Layout, RequireAuth } from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import EditPostPage from "./routes/editPostPage/EditPostPage";
import { listPageLoader, profilePageLoader, singlePageLoader } from "./lib/loaders";
import RequestVerification from "./routes/register/requestVerification";
import VerifyEmail from "./routes/verifyEmail/verifyEmail";
import ForgotPassword from "./routes/forgotPassword/forgotPassword";
import ResetPassword from "./routes/resetPassword/resetPassword";
import AdminDashboard from "./routes/admin/adminDasboard";
import RequireAdmin from "./routes/admin/requireAdmin";
import ManageUsers from "./routes/manage/manageUsers";
import ManagePosts from "./routes/manage/managePosts";
import ViewReports from "./routes/manage/viewReports";
import AdminStats from "./routes/admin/AdminStats";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/list",
          element: <ListPage />,
          loader: listPageLoader,
        },
        {
          path: "/:id",
          element: <SinglePage />,
          loader: singlePageLoader,
        },

        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        { 
          path: "/request-verification", 
          element: <RequestVerification /> 
        },
        { 
          path: "/verify-email", 
          element: <VerifyEmail /> 
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "/reset-password",
          element: <ResetPassword />,
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/add",
          element: <NewPostPage />,
        },
        {
          path: "/edit-post/:id",
          element: <EditPostPage />,
        },
      ],
    },
    {
      path: "/admin",
      element: <RequireAdmin />, // Protect admin routes
      children: [
        {
          path: "/admin",
          element: <AdminDashboard />,
          children: [
            {
              path: "users",
              element: <ManageUsers />,
            },
            {
              path: "posts",
              element: <ManagePosts />,
            },
            {
              path: "reports",
              element: <ViewReports />,
            },
            {
              path: "stats",
              element: <AdminStats />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
