import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/PostJob";
import Applications from "./pages/Applications";
import CodingProblem from "./pages/CodingProblem";
import Interview from "./pages/Interview";
import ProtectedRoute from "./components/ProtectedRoute";
import CodeEditor from "./pages/CodeEditor";
import AIInterviewer from "./pages/AIInterviewer";
import MyJob from "./pages/MyJob";
import Homepage from "./pages/Homepage";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            // <ProtectedRoute>
            <Homepage />
            // <Homepage />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            // <ProtectedRoute>
            <Home />
            // <Homepage />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            // <ProtectedRoute>
            <Profile />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            // <ProtectedRoute>
            <JobDetails />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/post-job"
          element={
            // <ProtectedRoute>
            <PostJob />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            // <ProtectedRoute>
            <Applications />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/coding/:jobId"
          element={
            // <ProtectedRoute>
            <CodingProblem />
            // </ProtectedRoute>
          }
        />
        <Route
          // path="/interview/:applicationId"
          path="/interview/:jobId"
          element={
            // <ProtectedRoute>
            <Interview />
            // </ProtectedRoute>
          }
        />
        <Route path="/codeeditor/:applicationId" element={<CodeEditor />} />
        <Route
          // path="/interview/:applicationId"
          path="/aiinterview"
          element={
            // <ProtectedRoute>
            <AIInterviewer />
            // </ProtectedRoute>
          }
        />
        <Route path="/myjob" element={<MyJob />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
