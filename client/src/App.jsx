import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import {Toaster} from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";

export default function App() {
const {authUser, loading}  = useContext(AuthContext)


if(loading) return <div className="bg-[url('./assets/bgImage.svg')] bg-cover bg-no-repeat flex items-center justify-center h-screen text-white">Loading...</div>

  return (
    <div className="bg-[url('/bgImage.svg')] bg-cover bg-no-repeat ">
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}  />
        {/* <Route path="/auth" element={<AuthPage />} /> */}
      </Routes>
      <Toaster />
    </div>
  )
}