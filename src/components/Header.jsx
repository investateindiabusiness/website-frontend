"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from './ui/button';
import { Menu, X, LogOut, UserCircle, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';


const HeaderContent = ({ transparent = false }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const moreDropdownRef = useRef(null);



  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    router.push('/');
  };

  const handleAuthClick = (action, role) => {
    setMobileMenuOpen(false);
    if (action === 'login') {
      router.push(role === 'builder' ? '/builder/login' : '/investor/login');
    } else {
      router.push(role === 'builder' ? '/builder/register' : '/investor/register');
    }
  };

  const getDashboardPath = (role) => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'builder') return '/builder/dashboard';
    if (role === 'serviceProvider') return '/service-provider/dashboard';
    return '/dashboard';
  };

  const isDashboardArea = pathname.startsWith('/admin') ||
    pathname.startsWith('/builder/') || pathname === '/builder/dashboard' || pathname === '/builder/projects' || pathname === '/builder/advertisements' ||
    pathname.startsWith('/service-provider/') || pathname === '/service-provider/dashboard' || pathname === '/service-provider/advertisements' ||
    pathname === '/dashboard' || pathname === '/properties' || pathname.startsWith('/investor/') || pathname.startsWith('/project/');

  const displayUser = isDashboardArea ? user : null;

  // Primary nav links — always visible in navbar
  const getNavLinks = () => {
    if (!displayUser) {
      return [
        { label: 'Home', path: '/' },
        { label: 'Builder', path: '/builder' },
        { label: 'Service Provider', path: '/service-provider' },
        { label: 'About Us', path: '/about-us' },
        { label: 'Gallery', path: '/gallery' },
        { label: 'Contact Us', path: '/contact-us' },
      ];
    }
    switch (displayUser.role) {
      case 'admin':    return [{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Builders', path: '/admin/builders' }, { label: 'Investors', path: '/admin/investors' }, { label: 'Service Providers', path: '/admin/service-providers' }, { label: 'Projects', path: '/admin/projects' }];
      case 'builder':  return [{ label: 'Dashboard', path: '/builder/dashboard' }, { label: 'Projects', path: '/builder/projects' }, { label: 'Advertise', path: '/builder/advertisements' }, { label: 'Coupons', path: '/builder/coupons' }];
      case 'serviceProvider': return [{ label: 'Dashboard', path: '/service-provider/dashboard' }, { label: 'Advertise', path: '/service-provider/advertisements' }, { label: 'Coupons', path: '/service-provider/coupons' }];
      case 'investor': return [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Properties', path: '/properties' }, { label: 'Coupons', path: '/investor/coupons' }];
      default:         return [{ label: 'Home', path: '/' }];
    }
  };

  // Secondary admin links — shown in "More" dropdown only
  const adminMoreLinks = displayUser?.role === 'admin' ? [
    { label: 'Leads',          path: '/admin/leads' },
    { label: 'Inquiries',      path: '/admin/inquiries' },
    { label: 'Helpdesk',       path: '/admin/helpdesk' },
    { label: 'Newsletter',     path: '/admin/newsletter' },
    { label: 'Advertisements', path: '/admin/advertisements' },
    { label: 'Coupons',        path: '/admin/coupons' },
  ] : [];

  const navLinks = getNavLinks();

  // Check if any "More" item is the active page (to highlight the More button)
  const isMoreActive = adminMoreLinks.some(l => pathname === l.path);

  const logoHref = user ? getDashboardPath(user.role) : '/';

  return (
    <>
      <header className={`fixed w-full top-0 left-0 right-0 z-[1000] transition-all duration-300 bg-[#232325] border-b border-gray-800 text-gray-300`}>
        <div className="h-16 flex items-center justify-between mx-4">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            {user ? (
              <div className="flex items-center cursor-default">
                <img src="/logo-big.png" alt="LOGO" className="hidden md:block h-32 w-auto object-contain" />
                <img src="/logo-small-white.png" alt="LOGO" className="block md:hidden h-24 w-auto object-contain" />
              </div>
            ) : (
              <Link href="/" className="flex items-center">
                <img src="/logo-big.png" alt="LOGO" className="hidden md:block h-32 w-auto object-contain" />
                <img src="/logo-small-white.png" alt="LOGO" className="block md:hidden h-24 w-auto object-contain" />
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

          {/* Desktop Auth Actions */}
          {displayUser ? (
            <div className="hidden md:flex items-center gap-3 mr-4 shrink-0">
              <Link href={getDashboardPath(displayUser.role)} className="flex items-center gap-2 text-xs font-bold bg-gray-800/60 px-4 py-2 rounded-full border border-gray-700/50 text-gray-200 shadow-inner hover:bg-gray-700 transition-all">
                <UserCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="max-w-[120px] truncate">{displayUser.name || displayUser.email?.split('@')[0]}</span>
                <span className="text-[9px] uppercase tracking-wider bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/20">{displayUser.role}</span>
              </Link>
              <Button
                onClick={handleLogout}
                className="h-9 px-4 text-xs font-black uppercase tracking-widest text-red-400 bg-transparent hover:text-red-300 hover:bg-red-950/20 flex items-center gap-1.5 rounded-full transition-all border border-red-900/30 hover:border-red-900/50"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </Button>
            </div>
          ) : null}

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-4">
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