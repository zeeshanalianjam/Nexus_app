import React, { useContext } from 'react';
import { Button } from './ui/Button';
import { User, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onProfileClick, onLogoutClick }) => {
  const { logout} = useContext(AuthContext)
  const navigate = useNavigate();

  return (
    <nav className="glass border-b border-white/20 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="text-white font-semibold text-xl">NEXUS</span>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="text-white hover:bg-white/10 flex items-center space-x-2"
          >
            <User size={18} />
            <span>Profile</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            className="text-white hover:bg-white/10 flex items-center space-x-2"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

