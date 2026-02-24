import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Search,
  UserCircle, // Using UserCircle to match the rounded icon in image
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/AuthContext';

const Header = ({ transparent = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // User Icon Dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'builder': return '/partner/dashboard';
      case 'investor': return '/dashboard';
      default: return '/';
    }
  };

  // Define links based on the reference image style
  // You can adjust these based on your actual routes
  const publicLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about-us' },
    { label: 'Properties', path: '/projects' },
    { label: 'How It Works', path: '/how-it-works' }, // Assuming you have this route
    { label: 'Contact Us', path: '/contact-us' },
  ];

  return (
    <header
      className={`fixed w-full top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#121212] border-b border-gray-800 text-gray-300`}
    >
      <div className="h-16 flex items-center justify-between  mx-4">

        {/* --- LEFT: LOGO --- */}
        <div className="flex items-center shrink-0">
          <Link to="/" className="flex items-center">

            {/* Desktop Logo */}
            <img
              src="/logo-big.png"
              alt="LOGO"
              className="hidden md:block h-14 w-auto object-contain"
            />

            {/* Mobile Logo */}
            <img
              src="/logo-small-white.png"
              alt="LOGO123"
              className="block md:hidden h-14 w-auto object-contain"
            />

          </Link>
        </div>


        {/* --- CENTER: NAVIGATION (Desktop) --- */}
        <nav className="hidden md:flex items-center flex-1 mx-32">
          <ul className="flex items-center justify-between w-full text-md font-medium text-gray-400">
            {publicLinks.map((link, index) => (
              <React.Fragment key={link.label}>
                <li>
                  <Link
                    to={link.path}
                    className="hover:text-white transition-colors px-3 lg:px-5 py-2 block"
                  >
                    {link.label}
                  </Link>
                </li>

                {index < publicLinks.length - 1 && (
                  <span className="text-gray-700 select-none">|</span>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>


        {/* --- RIGHT: ICONS (Search & User) --- */}
        <div className="hidden md:flex items-center space-x-6">

          {/* Search Icon */}
          {/* <button className="text-gray-400 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button> */}

          {/* User / Profile Icon with Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button className="flex items-center text-gray-400 hover:text-white transition-colors py-2">
              {/* Using a generic UserCircle to match the reference image's right-most icon */}
              <UserCircle className="w-6 h-6" />
            </button>

            {/* Dropdown Menu */}
            {open && (
              <div className="absolute right-0 top-full mt-0 w-56 bg-[#1a1a1a] border border-gray-700 rounded shadow-xl py-2 z-50 text-gray-300">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-700 mb-2">
                      <p className="text-xs text-gray-500 uppercase">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                    </div>
                    <Link to={getDashboardLink()} className="block px-4 py-2 hover:bg-gray-800 hover:text-white">
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-800 hover:text-white">
                      Login
                    </Link>
                    <Link to="/register" className="block px-4 py-2 hover:bg-gray-800 hover:text-white">
                      Register
                    </Link>
                    <div className="border-t border-gray-700 my-1"></div>
                    <Link to="/partner/login" className="block px-4 py-2 hover:bg-gray-800 hover:text-white text-xs">
                      Partner Login
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <div className="md:hidden flex items-center gap-4">
          {/* Mobile Search Icon */}
          {/* <button className="text-gray-400">
            <Search className="w-5 h-5" />
          </button> */}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <div
        className={`md:hidden fixed inset-0 top-16 bg-[#121212] z-40 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full p-6 overflow-y-auto text-gray-300">

          {/* Mobile Navigation Links */}
          <div className="space-y-1 mb-8">
            {publicLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-2 text-lg font-medium border-b border-gray-800 hover:text-white hover:border-gray-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Auth Actions */}
          <div className="mt-auto pb-8">
            {user ? (
              <div className="space-y-3">
                <div className="p-3 bg-gray-800 rounded mb-4">
                  <p className="text-xs text-gray-400">Account</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
                <Button
                  onClick={() => { navigate(getDashboardLink()); setMobileMenuOpen(false); }}
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                </Button>
                <Button onClick={handleLogout} variant="destructive" className="w-full">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                  Login
                </Button>
                <Button
                  onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                  className="bg-[#C88A58] hover:bg-[#b0784a] text-white"
                >
                  Register
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;