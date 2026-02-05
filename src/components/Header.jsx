import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  Building2,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
  User,
  UserPlus,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/hooks/AuthContext';

const Header = ({ transparent = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // Laptop Login Dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile Hamburger Menu
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setShow(false);
        } else {
          setShow(true);
        }
        setLastScrollY(window.scrollY);
      }
    };
    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin': return '/admin/dashboard';
      case 'builder': return '/partner/dashboard';
      case 'investor': return '/dashboard';
      default: return '/';
    }
  };

  const handleMouseEnter = (e) => {
    const el = e.currentTarget;
    setUnderlineStyle({
      left: el.offsetLeft,
      width: el.offsetWidth,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setUnderlineStyle((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <header
      className={`fixed w-full top-0 left-0 right-0 z-50 transition-transform duration-300 ${transparent ? 'bg-transparent' : 'bg-white shadow-sm'
        } ${show ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="px-4 py-2">
        <div className="container w-full mx-auto flex items-center justify-between">

          {/* LOGO: Responsive Handling */}
          <Link to="/" className="flex items-center">
            {/* Desktop Logo */}
            <img
              src="/logo-big.png"
              alt="INVESTATE INDIA"
              className="hidden md:block h-14 lg:h-16 w-auto object-contain"
            />
            {/* Mobile Logo: Smaller/Compact version if you have it, or same but scaled */}
            <img
              src="/logo-big.png"
              alt="INVESTATE INDIA"
              className="md:hidden h-10 w-auto object-contain"
            />
          </Link>

          {/* DESKTOP NAVIGATION (md and up) */}
          <nav
            className="hidden md:flex items-center space-x-6 relative px-2 pb-0"
            onMouseLeave={handleMouseLeave}
          >
            {/* THE MAGIC UNDERLINE - Moved to the top of nav so it stays on top of the stack */}
            <div
              className="absolute bottom-0 h-0.5 bg-[#FB923C] transition-all duration-300 ease-out pointer-events-none"
              style={{
                left: `${underlineStyle.left}px`,
                width: `${underlineStyle.width}px`,
                opacity: underlineStyle.opacity,
              }}
            />

            {/* INVESTOR LINKS */}
            {user && user.role === 'investor' && (
              <Link
                to="/projects"
                onMouseEnter={handleMouseEnter}
                className="font-medium text-[#08294F] hover:text-[#FB923C] transition-colors py-1"
              >
                Browse Projects
              </Link>
            )}

            {/* ADMIN LINKS */}
            {user && user.role === 'admin' && (
              <>
                <Link to="/admin/dashboard" onMouseEnter={handleMouseEnter} className="font-medium text-[#08294F] hover:text-[#FB923C] transition-colors py-1">Dashboard</Link>
                <Link to="/admin/projects" onMouseEnter={handleMouseEnter} className="font-medium text-[#08294F] hover:text-[#FB923C] transition-colors py-1">Projects</Link>
                <Link to="/admin/investors" onMouseEnter={handleMouseEnter} className="font-medium text-[#08294F] hover:text-[#FB923C] transition-colors py-1">Investors</Link>
                <Link to="/admin/builders" onMouseEnter={handleMouseEnter} className="font-medium text-[#08294F] hover:text-[#FB923C] transition-colors py-1">Builders</Link>
              </>
            )}

            {/* BUILDER LINKS */}
            {user && user.role === 'builder' && (
              <>
                <Link to="/partner/dashboard" onMouseEnter={handleMouseEnter} className="font-medium text-[#08294F] hover:text-[#FB923C] transition-colors flex items-center gap-2 py-1">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link to="/partner/add-project" onMouseEnter={handleMouseEnter} className="font-medium text-[#08294F] hover:text-[#FB923C] transition-colors flex items-center gap-2 py-1">
                  Add Project
                </Link>
              </>
            )}

            {/* PUBLIC LINKS (Shown only when logged out) */}
            {!user && (
              <>
                {[
                  { label: 'Properties', path: '/' },
                  { label: 'Cities', path: '/' },
                  { label: 'About Us', path: '/about-us' }, // ✅ custom route
                  { label: 'Insights', path: '/' },
                  { label: 'Contact Us', path: '/contact-us' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onMouseEnter={handleMouseEnter}
                    className="font-medium text-[#08294F] hover:text-[#FB923C] transition-colors py-1"
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}


            {/* ACTION BUTTONS (Logout / Login Dropdown) */}
            <div className="flex items-center space-x-3 ml-4">
              {user ? (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              ) : (
                <>
                  <div
                    className="relative"
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                  >
                    <Button className="bg-[#08294F] hover:bg-[#021021] text-white flex items-center gap-1">
                      Login <ChevronDown className="h-4 w-4" />
                    </Button>
                    {open && (
                      <div className="absolute right-0 w-56 bg-white border rounded shadow-lg pt-2 pb-2">
                        <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Login as Investor</Link>
                        <Link to="/register" className="block px-4 py-2 hover:bg-gray-100 border-b">Register as Investor</Link>
                        <Link to="/partner/login" className="block px-4 py-2 hover:bg-gray-100">Login as Partner</Link>
                      </div>
                    )}
                  </div>
                  <Button onClick={() => navigate('/partner/register')} className="bg-orange-500 hover:bg-orange-600 whitespace-nowrap">
                    Register as Partner
                  </Button>
                </>
              )}
            </div>
          </nav>

          {/* MOBILE TOGGLE: 3 Bars Menu */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#08294F]"
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </Button>
          </div>

        </div>
      </div>

      {/* MOBILE FULL-SCREEN MENU */}
      <div className={`md:hidden fixed inset-0 top-[60px] bg-white z-40 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-[calc(100vh-60px)] p-6 space-y-8 overflow-y-auto bg-gray-50">

          {user ? (
            /* Logged In View */
            <div className="space-y-4">
              <div className="p-4 bg-white border rounded-2xl shadow-sm">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Account</p>
                <p className="font-semibold text-blue-900 truncate">{user.email}</p>
              </div>

              <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-white border rounded-xl">
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">My Dashboard</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>

              <Button onClick={handleLogout} variant="destructive" className="w-full h-12 rounded-xl mt-4">
                <LogOut className="h-5 w-5 mr-2" /> Logout
              </Button>
            </div>
          ) : (
            /* Logged Out View - LOGIN/REGISTER BUTTONS ADDED HERE */
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Explore</p>
                {[
                  { label: 'Properties', path: '/' },
                  { label: 'Cities', path: '/' },
                  { label: 'About Us', path: '/about-us' },
                  { label: 'Insights', path: '/' },
                  { label: 'Contact Us', path: '/contact-us' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 px-2 text-lg font-medium text-[#08294F] border-b border-gray-100 flex items-center justify-between"
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </Link>
                ))}

              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">Investor Access</p>
                <div className="grid grid-cols-1 gap-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-white border rounded-xl">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-blue-600" />
                      <span className="font-bold text-gray-800">Login as Investor</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-white border rounded-xl">
                    <div className="flex items-center gap-3">
                      <UserPlus className="h-5 w-5 text-orange-500" />
                      <span className="font-bold text-gray-800">Register as Investor</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">Partner Portal</p>
                <Link to="/partner/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between p-4 bg-blue-900 text-white rounded-xl mb-3">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-orange-400" />
                    <span className="font-bold">Partner Login</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-white/50" />
                </Link>
                <Button
                  onClick={() => { setMobileMenuOpen(false); navigate('/partner/register'); }}
                  className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-lg font-bold rounded-xl shadow-lg"
                >
                  Join as a Partner
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;