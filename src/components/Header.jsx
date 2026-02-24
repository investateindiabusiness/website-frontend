import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  Menu,
  X,
  LogOut,
  UserCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/AuthContext';

// IMPORTANT: Adjust these paths to where your dialog components are located
import LoginDialog from '@/components/LoginDialog';
import RegisterDialog from '@/components/RegisterDialog';

const Header = ({ transparent = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // UI States
  const [open, setOpen] = useState(false); // User Icon Dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dialog States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerInitialData, setRegisterInitialData] = useState({});

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setOpen(false);
    navigate('/');
  };

  // Dialog Handlers
  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
    setMobileMenuOpen(false);
    setOpen(false);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
    setMobileMenuOpen(false);
    setOpen(false);
  };

  const handleAuthClick = (role) => {
    setRegisterInitialData({ role });
    openLogin();
  };

  // Dynamic Navigation Links based on authentication and roles
  const getNavLinks = () => {
    if (!user) {
      return [
        { label: 'Home', path: '/' },
        { label: 'About Us', path: '/about-us' },
        { label: 'Insights', path: '/' },
        { label: 'Contact Us', path: '/contact-us' },
      ];
    }

    switch (user.role) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Builders', path: '/admin/builders' },
          { label: 'Investors', path: '/admin/investors' },
        ];
      case 'builder':
        return [
          { label: 'Dashboard', path: '/partner/dashboard' },
          { label: 'Projects', path: '/partner/projects' },
        ];
      case 'investor':
        return [
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Properties', path: '/properties' },
        ];
      default:
        return [
          { label: 'Home', path: '/' },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      <header
        className={`fixed w-full top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#121212] border-b border-gray-800 text-gray-300`}
      >
        <div className="h-16 flex items-center justify-between mx-4">

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
                alt="LOGO"
                className="block md:hidden h-14 w-auto object-contain"
              />
            </Link>
          </div>

          {/* --- CENTER: NAVIGATION (Desktop) --- */}
          <nav className="hidden md:flex items-center flex-1 mx-32">
            <ul className="flex items-center justify-center w-full text-md font-medium text-gray-400">
              {navLinks.map((link, index) => (
                <React.Fragment key={link.label}>
                  <li>
                    <Link
                      to={link.path}
                      className="hover:text-white transition-colors px-3 lg:px-5 py-2 block mx-4"
                    >
                      {link.label}
                    </Link>
                  </li>
                  {index < navLinks.length - 1 && (
                    <span className="text-gray-700 select-none">|</span>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </nav>

          {/* --- RIGHT: ICONS (User) --- */}
          <div className="hidden md:flex items-center space-x-6">
            <div
              className="relative"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              <button className="flex items-center text-gray-400 hover:text-white transition-colors py-2">
                <UserCircle className="w-6 h-6" />
              </button>

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute right-0 top-full -mt-2 w-64 bg-[#1a1a1a] border border-gray-700 rounded shadow-xl z-50 text-gray-300">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-700 mb-2">
                        <p className="text-xs text-gray-500 uppercase">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 hover:text-red-300 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleAuthClick('investor')}
                        className="w-full text-left block px-4 py-3 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        Login/Register as an Investor
                      </button>
                      <div className="border-t border-gray-700"></div>
                      <button 
                        onClick={() => handleAuthClick('builder')}
                        className="w-full text-left block px-4 py-3 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        Login/Register as a Partner
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className="md:hidden flex items-center gap-4">
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
          className={`md:hidden fixed inset-0 top-16 bg-[#121212] z-40 transition-transform duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full p-6 overflow-y-auto text-gray-300">
            {/* Mobile Navigation Links */}
            <div className="space-y-1 mb-8">
              {navLinks.map((item) => (
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
                  <Button onClick={handleLogout} variant="destructive" className="w-full">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => handleAuthClick('investor')}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white py-6"
                  >
                    Login/Register as an Investor
                  </Button>
                  <Button
                    onClick={() => handleAuthClick('builder')}
                    className="w-full bg-[#C88A58] hover:bg-[#b0784a] text-white py-6"
                  >
                    Login/Register as a Partner
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* --- AUTH DIALOGS --- */}
      {/* Uncomment these when you have imported the components */}
      <LoginDialog 
        isOpen={isLoginOpen} 
        onOpenChange={setIsLoginOpen} 
        onSwitchToRegister={openRegister} 
      />

      <RegisterDialog 
        isOpen={isRegisterOpen} 
        onOpenChange={setIsRegisterOpen} 
        onLoginClick={openLogin}
        initialData={registerInitialData}
      />
    </>
  );
};

export default Header;