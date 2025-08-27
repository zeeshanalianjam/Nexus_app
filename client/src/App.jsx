import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import {Toaster} from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import './App.css';
import InvestorDashboard from "./pages/InvestorDashboard";
import EntrepreneurDashboard from "./pages/EnterpreneurDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
const {authUser, loading}  = useContext(AuthContext)


if(loading) return <div className="bg-[url('./assets/bgImage.svg')] bg-cover bg-no-repeat flex items-center justify-center h-screen text-white">Loading...</div>

  return (
    <div className="bg-[url('/bgImage.svg')] bg-cover bg-no-repeat ">
      <Routes>
        <Route path="/" element={<Navigate to={authUser?.role === "investor" ? "/investor" : "/entrepreneur"} />} />
        <Route path="/investor" element={<ProtectedRoute> <InvestorDashboard /></ProtectedRoute>} />
        <Route path="/entrepreneur" element={<ProtectedRoute><EntrepreneurDashboard /></ProtectedRoute> } />
        <Route path="/chat-page" element={<ProtectedRoute><HomePage /></ProtectedRoute>  } />
        <Route path="/login" element={<LoginPage /> } />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>  }  />
        
        {/* page not found route */}
        <Route path="*" element={<div className="bg-[url('./assets/bgImage.svg')] bg-cover bg-no-repeat flex items-center justify-center h-screen text-white">Page not found</div>} />


        {/* <Route path="/auth" element={<AuthPage />} /> */}
      </Routes>
      <Toaster />
    </div>
  )
}