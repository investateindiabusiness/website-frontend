"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from './ui/button';
import { Menu, X, LogOut, UserCircle, LayoutDashboard, ChevronDown, User, Pencil, ChevronLeft, ChevronRight, Briefcase, Award, Compass, HelpCircle, Network, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import { apiRequest } from '@/api';


const HeaderContent = ({ transparent = false }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const moreDropdownRef = useRef(null);
  const [logoMenuOpen, setLogoMenuOpen] = useState(false);
  const logoMenuRef = useRef(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', contactNumber: '', address: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target)) {
        setMoreDropdownOpen(false);
      }
      if (logoMenuRef.current && !logoMenuRef.current.contains(e.target)) {
        setLogoMenuOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    setProfileDropdownOpen(false);
    router.push('/');
  };

  const handleOpenEdit = () => {
    setEditForm({
      name: displayUser?.name || '',
      contactNumber: displayUser?.contactNumber || '',
      address: displayUser?.address || ''
    });
    setShowEditModal(true);
    setProfileDropdownOpen(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      await apiRequest('/api/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(editForm)
      });
      toast({ title: 'Profile Updated', description: 'Your profile has been saved successfully.' });
      setShowEditModal(false);
    } catch (err) {
      toast({ title: 'Update Failed', description: err.message || 'Could not update profile.', variant: 'destructive' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAuthClick = (action, role) => {
    setMobileMenuOpen(false);
    if (action === 'login') {
      if (role === 'builder') router.push('/builder/login');
      else if (role === 'serviceProvider') router.push('/service-provider/login');
      else router.push('/investor/login');
    } else {
      if (role === 'builder') router.push('/builder/register');
      else if (role === 'serviceProvider') router.push('/service-provider/register');
      else router.push('/investor/register');
    }
  };

  const getDashboardPath = (role) => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'builder') return '/builder/dashboard';
    if (role === 'serviceProvider') return '/service-provider/dashboard';
    return '/dashboard';
  };

  const isDashboardArea =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/builder') ||
    pathname.startsWith('/service-provider') ||
    pathname.startsWith('/investor') ||
    pathname.startsWith('/partner') ||
    pathname.startsWith('/project') ||
    pathname === '/dashboard' ||
    pathname === '/properties';

  const displayUser = isDashboardArea ? user : null;

  // Primary nav links — always visible in navbar
  const getNavLinks = () => {
    if (!displayUser) {
      return [
        { label: 'Home', path: '/home' },
        { label: 'Investor', path: '/investor' },
        { label: 'Builder', path: '/builder' },
        { label: 'Service Provider', path: '/service-provider' },
        // { label: 'About Us', path: '/about-us' },
        { label: 'Gallery', path: '/gallery' },
      ];
    }
    switch (displayUser.role) {
      case 'admin': return [
        { label: 'Dashboard', path: '/admin/dashboard' },
        { label: 'Builders', path: '/admin/builders' },
        { label: 'Investors', path: '/admin/investors' },
        { label: 'Projects', path: '/admin/projects' },
        { label: 'Users', path: '/admin/users' },
      ];
      case 'builder': return [
        { label: 'Dashboard', path: '/builder/dashboard' },
        { label: 'Projects', path: '/builder/projects' },
        { label: 'Advertise', path: '/builder/advertisements' },
        { label: 'Payments', path: '/builder/payments' },
        { label: 'Coupons', path: '/builder/coupons' },
      ];
      case 'serviceProvider': return [
        { label: 'Dashboard', path: '/service-provider/dashboard' },
        { label: 'Advertise', path: '/service-provider/advertisements' },
        { label: 'Payments', path: '/service-provider/payments' },
        { label: 'Coupons', path: '/service-provider/coupons' },
      ];
      case 'investor': return [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Properties', path: '/properties' },
        { label: 'Advertise', path: '/investor/advertisements' },
        { label: 'Payments', path: '/investor/payments' },
        { label: 'Coupons', path: '/investor/coupons' },
      ];
      default: return [{ label: 'Investor', path: '/' }];
    }
  };

  // Secondary admin links — shown in "More" dropdown only
  const adminMoreLinks = [];

  const navLinks = getNavLinks();

  // Check if any "More" item is the active page (to highlight the More button)
  const isMoreActive = adminMoreLinks.some(l => pathname === l.path);

  const logoHref = user ? getDashboardPath(user.role) : '/home';

  return (
    <>
      <header className={`fixed w-full top-0 left-0 right-0 z-[1000] transition-all duration-300 bg-[#232325] border-b border-gray-800 text-gray-300`}>
        <div className="h-16 flex items-center justify-between mx-4">
          {/* Logo */}
          <div className="flex items-center shrink-0 relative" ref={logoMenuRef}>
            {user?.role === 'admin' ? (
              <>
                <button
                  onClick={() => {
                    setLogoMenuOpen(prev => !prev);
                  }}
                  className="flex items-center focus:outline-none cursor-pointer"
                >
                  <img src="/logo-big.png" alt="LOGO" className="hidden md:block h-12 w-auto object-contain" />
                  <img src="/logo-small-white.png" alt="LOGO" className="block md:hidden h-10 w-auto object-contain" />
                  <ChevronDown className={`w-4 h-4 ml-1 text-gray-400 transition-transform duration-200 ${logoMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {logoMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-[#1a1a1c] border border-gray-700/60 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-[2000] animate-in fade-in slide-in-from-top-2 duration-150 py-2">
                    <div className="px-4 py-2 border-b border-gray-800/60 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Admin Portal
                    </div>
                    {[
                      { label: 'Dashboard', path: '/admin/dashboard' },
                      { label: 'Builders', path: '/admin/builders' },
                      { label: 'Investors', path: '/admin/investors' },
                      { label: 'Service Providers', path: '/admin/service-providers' },
                      { label: 'Users', path: '/admin/users' },
                      { label: 'Projects', path: '/admin/projects' },
                      { label: 'Leads', path: '/admin/leads' },
                      { label: 'Inquiries', path: '/admin/inquiries' },
                      { label: 'Helpdesk', path: '/admin/helpdesk' },
                      { label: 'Newsletter', path: '/admin/newsletter' },
                      { label: 'Advertisements', path: '/admin/advertisements' },
                      { label: 'Coupons', path: '/admin/coupons' },
                    ].map((link) => {
                      const isActive = pathname === link.path;
                      return (
                        <Link
                          key={link.label}
                          href={link.path}
                          onClick={() => setLogoMenuOpen(false)}
                          className={`flex items-center px-4 py-3 text-sm font-medium transition-colors border-b border-gray-800/40 last:border-0 ${isActive
                            ? 'text-[#D48035] bg-orange-500/5 font-semibold'
                            : 'text-gray-300 hover:text-[#D48035] hover:bg-gray-800/50'
                            }`}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={logoHref}
                className="flex items-center cursor-pointer"
              >
                <img src="/logo-big.png" alt="LOGO" className="hidden md:block h-12 w-auto object-contain" />
                <img src="/logo-small-white.png" alt="LOGO" className="block md:hidden h-10 w-auto object-contain" />
              </Link>
            )}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center flex-1 px-4">
            <ul className="flex items-center justify-center w-full text-sm lg:text-base font-medium text-gray-400">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.path;
                return (
                  <React.Fragment key={link.label}>
                    <li>
                      <Link
                        href={link.path}
                        className={`transition-colors px-2 lg:px-4 py-2 block mx-1 lg:mx-2 xl:mx-3 text-nowrap ${isActive ? 'text-[#D48035]' : 'hover:text-[#D48035]'}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                    {(index < navLinks.length - 1 || adminMoreLinks.length > 0) && (
                      <span className="text-gray-700 select-none">|</span>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Admin "More" dropdown */}
              {adminMoreLinks.length > 0 && (
                <li className="relative" ref={moreDropdownRef}>
                  <button
                    onClick={() => setMoreDropdownOpen(prev => !prev)}
                    className={`flex items-center gap-1 transition-colors px-2 lg:px-4 py-2 mx-1 lg:mx-2 xl:mx-3 text-nowrap rounded-md ${isMoreActive ? 'text-[#D48035]' : 'hover:text-[#D48035]'}`}
                  >
                    More
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown panel */}
                  {moreDropdownOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#1a1a1c] border border-gray-700/60 rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      {adminMoreLinks.map((link) => {
                        const isActive = pathname === link.path;
                        return (
                          <Link
                            key={link.label}
                            href={link.path}
                            onClick={() => setMoreDropdownOpen(false)}
                            className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors border-b border-gray-800/60 last:border-0 ${isActive ? 'text-[#D48035] bg-orange-500/5' : 'text-gray-400 hover:text-[#D48035] hover:bg-gray-800/50'}`}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </li>
              )}
            </ul>
          </nav>

          {/* Desktop Right Corner Actions */}
          <div className="hidden md:flex items-center gap-4 mr-4 shrink-0">
            <Link
              href="/contact-us"
              className="bg-[#D48035] hover:bg-[#B45309] text-white text-xs md:text-sm font-semibold px-5 py-2 rounded-full shadow-lg hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Contact Us
            </Link>

            {displayUser && (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 text-xs font-bold bg-gray-800/60 px-4 py-2 rounded-full border border-gray-700/50 text-gray-200 shadow-inner hover:bg-gray-700 transition-all"
                >
                  <UserCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span className="max-w-[120px] truncate">{displayUser.name || displayUser.email?.split('@')[0]}</span>
                  <span className="text-[9px] uppercase tracking-wider bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/20">{displayUser.role}</span>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-52 bg-[#1a1a1c] border border-gray-700/60 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-[2000] animate-in fade-in slide-in-from-top-2 duration-150 py-2">
                    <div className="px-4 py-2 border-b border-gray-800/60">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Account</p>
                      <p className="text-xs text-gray-300 font-medium truncate mt-0.5">{displayUser.email}</p>
                    </div>
                    <button
                      onClick={() => { setShowProfileModal(true); setProfileDropdownOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-[#D48035] hover:bg-gray-800/50 transition-colors"
                    >
                      <User className="w-4 h-4" /> View Profile
                    </button>
                    <button
                      onClick={handleOpenEdit}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-300 hover:text-[#D48035] hover:bg-gray-800/50 transition-colors border-b border-gray-800/40"
                    >
                      <Pencil className="w-4 h-4" /> Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-4">
            <Link
              href="/contact-us"
              className="bg-[#D48035] hover:bg-[#B45309] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Contact Us
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300 hover:text-white">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-in menu */}
        <div className={`md:hidden fixed inset-0 top-16 bg-[#232325] z-40 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full p-6 overflow-y-auto text-gray-300">
            <div className="space-y-1 mb-4">
              {/* Primary links */}
              {navLinks.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link key={item.label} href={item.path} onClick={() => setMobileMenuOpen(false)} className={`block py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors ${isActive ? 'text-[#D48035]' : 'text-gray-300 hover:text-[#D48035]'}`}>
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Admin secondary links group */}
            {adminMoreLinks.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold px-4 mb-2">More</p>
                <div className="space-y-1 border-t border-gray-800 pt-3">
                  {adminMoreLinks.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <Link key={item.label} href={item.path} onClick={() => setMobileMenuOpen(false)} className={`block py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors ${isActive ? 'text-[#D48035]' : 'text-gray-300 hover:text-[#D48035]'}`}>
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-auto pb-8">
              {displayUser ? (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-800 rounded mb-4">
                    <p className="text-xs text-gray-400">Account</p>
                    <p className="text-white font-medium">{displayUser.email}</p>
                  </div>
                  <Button onClick={() => { router.push(getDashboardPath(displayUser.role)); setMobileMenuOpen(false); }} className="w-full bg-[#D48035] hover:bg-[#B45309] text-white flex items-center justify-center gap-2">
                    <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                  </Button>
                  <Button onClick={handleLogout} variant="destructive" className="w-full">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button onClick={() => handleAuthClick('login', 'investor')} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-5 text-xs font-semibold">Login/Register as an Investor</Button>
                  <Button onClick={() => handleAuthClick('login', 'builder')} className="w-full bg-[var(--color-accent,#D48035)] hover:bg-[var(--color-accent-hover,#B45309)] text-white py-5 text-xs font-semibold">Login/Register as a Builder</Button>
                  <Button onClick={() => handleAuthClick('login', 'serviceProvider')} className="w-full bg-slate-700 hover:bg-slate-600 text-white py-5 text-xs font-semibold">Login/Register as Service Provider</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* View Profile Modal */}
      {showProfileModal && displayUser && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1a1c] border border-gray-700/60 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-white font-bold text-lg">My Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                  <UserCircle className="w-10 h-10 text-orange-400" />
                </div>
              </div>
              {[['Name', displayUser.name], ['Email', displayUser.email], ['Role', displayUser.role], ['Contact', displayUser.contactNumber], ['Address', displayUser.address]].map(([label, val]) => val ? (
                <div key={label} className="flex justify-between text-sm border-b border-gray-800 pb-2">
                  <span className="text-gray-500 font-medium">{label}</span>
                  <span className="text-gray-200 font-semibold text-right max-w-[60%] truncate">{val}</span>
                </div>
              ) : null)}
            </div>
            <div className="px-6 py-4 flex justify-end gap-2">
              <Button onClick={handleOpenEdit} className="bg-[#D48035] hover:bg-[#B45309] text-white text-xs rounded-xl">
                <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit Profile
              </Button>
              <Button variant="outline" onClick={() => setShowProfileModal(false)} className="text-xs rounded-xl border-gray-700 text-gray-300 hover:bg-gray-800">Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a1a1c] border border-gray-700/60 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-white font-bold text-lg">Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Contact Number</label>
                <input
                  type="text"
                  value={editForm.contactNumber}
                  onChange={e => setEditForm({ ...editForm, contactNumber: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-bold block mb-1">Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                  placeholder="Your address"
                  className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-orange-500 transition-colors"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} className="text-xs rounded-xl border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</Button>
                <Button type="submit" disabled={isSavingProfile} className="bg-[#D48035] hover:bg-[#B45309] text-white text-xs rounded-xl min-w-[80px]">
                  {isSavingProfile ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
};

const Header = (props) => {
  return (
    <Suspense fallback={<header className="fixed w-full top-0 left-0 right-0 z-[1000] h-16 bg-[#232325] border-b border-gray-800" />}>
      <HeaderContent {...props} />
    </Suspense>
  );
};

export default Header;
