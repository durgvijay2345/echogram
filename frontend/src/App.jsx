import React from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

// Hooks
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useGetAllPost from "./hooks/useGetAllPost";
import useGetAllLoops from "./hooks/useGetAllLoops";
import useGetAllStories from "./hooks/useGetAllStories";
import useGetFollowingList from "./hooks/useGetFollowingList";
import useGetPrevChatUsers from "./hooks/useGetPrevChatUsers";
import useGetAllNotifications from "./hooks/useGetAllNotifications";
import useGetSuggestedUsers from "./hooks/useGetSuggestedUsers";

// Pages
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Upload from "./pages/Upload";
import Loops from "./pages/Loops";
import Story from "./pages/Story";
import Messages from "./pages/Messages";
import MessageArea from "./pages/MessageArea";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Goodbye from "./pages/Goodbye";

// Routes
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

export const serverUrl = "https://echogram-backend-wkov.onrender.com";

function App() {
  const userLoading = useGetCurrentUser();
  useGetSuggestedUsers();
  useGetAllPost();
  useGetAllLoops();
  useGetAllStories();
  useGetFollowingList();
  useGetPrevChatUsers();
  useGetAllNotifications();

  const { userData } = useSelector((state) => state.user);

  // Show loading spinner until user data is fetched
  if (userLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          backgroundColor: "black",
        }}
      >
        <ClipLoader color="#ffffff" size={60} />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/signup"
        element={<PublicRoute>{!userData ? <SignUp /> : <Home />}</PublicRoute>}
      />
      <Route
        path="/signin"
        element={<PublicRoute>{!userData ? <SignIn /> : <Home />}</PublicRoute>}
      />
      <Route
        path="/forgot-password"
        element={<PublicRoute>{!userData ? <ForgotPassword /> : <Home />}</PublicRoute>}
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={<ProtectedRoute>{userData ? <Home /> : <SignIn />}</ProtectedRoute>}
      />
      <Route
        path="/profile/:userName"
        element={<ProtectedRoute>{userData ? <Profile /> : <SignIn />}</ProtectedRoute>}
      />
      <Route
        path="/editprofile"
        element={<ProtectedRoute>{userData ? <EditProfile /> : <SignIn />}</ProtectedRoute>}
      />
      <Route
        path="/upload"
        element={<ProtectedRoute>{userData ? <Upload /> : <SignIn />}</ProtectedRoute>}
      />
      <Route
        path="/loops"
        element={<ProtectedRoute>{userData ? <Loops /> : <SignIn />}</ProtectedRoute>}
      />
      <Route
        path="/story/:userName"
        element={<ProtectedRoute>{userData ? <Story /> : <SignIn />}</ProtectedRoute>}
      />
      <Route
        path="/messages"
        element={<ProtectedRoute>{userData ? <Messages /> : <SignIn />}</ProtectedRoute>}
      />
      <Route
        path="/messageArea"
        element={<ProtectedRoute>{userData ? <MessageArea /> : <SignIn />}</ProtectedRoute>}
      />
      <Route
        path="/search"
        element={<ProtectedRoute>{userData ? <Search /> : <SignIn />}</ProtectedRoute>}
      />
      <Route
        path="/notifications"
        element={<ProtectedRoute>{userData ? <Notifications /> : <SignIn />}</ProtectedRoute>}
      />

      <Route path="/goodbye" element={<Goodbye />} />
    </Routes>
  );
}

export default App; 




