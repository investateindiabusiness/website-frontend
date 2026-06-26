"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from './ui/button';
import { Menu, X, LogOut, UserCircle, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/AuthContext';
import { toast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';

const LoginDialog = dynamic(() => import('@/components/LoginDialog'), { ssr: false });
const RegisterDialog = dynamic(() => import('@/components/RegisterDialog'), { ssr: false });

const HeaderContent = ({ transparent = false }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [dialogData, setDialogData] = useState({});

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setOpen(false);
    router.push('/');
  };

  const openLogin = (role) => {
    if (typeof role === 'string') setDialogData({ userType: role }); // Use dialogData
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
    setMobileMenuOpen(false);
    setOpen(false);
  };

  const openRegister = (role) => {
    if (typeof role === 'string') setDialogData({ userType: role }); // Use dialogData
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
    setMobileMenuOpen(false);
    setOpen(false);
  };

  useEffect(() => {
    const loginParam = searchParams.get('login');
    const roleParam = searchParams.get('role');
    const expiredParam = searchParams.get('session_expired');

    if (expiredParam === 'true') {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please log in again.",
        variant: "destructive"
      });
      const cleanUrl = window.location.pathname + (loginParam ? `?login=${loginParam}&role=${roleParam}` : '');
      window.history.replaceState({}, '', cleanUrl);
    }

    if (loginParam === 'true') {
      openLogin(roleParam || 'investor');
    }
  }, [searchParams]);

  const handleSwitchToRegister = (dataPayload) => {
    setIsLoginOpen(false);
    if (typeof dataPayload === 'string') {
      setDialogData({ userType: dataPayload });
    } else if (dataPayload) {
      setDialogData(dataPayload);
    }
    setIsRegisterOpen(true);
  };

  const handleAuthClick = (action, role) => {
    if (action === 'login') {
      openLogin(role);
    } else {
      openRegister(role);
    }
  };

  const getDashboardPath = (role) => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'builder') return '/builder/dashboard';
    return '/dashboard';
  };

  const isDashboardArea = pathname.startsWith('/admin') ||
    pathname.startsWith('/builder/') || pathname === '/builder/dashboard' || pathname === '/builder/projects' ||
    pathname === '/dashboard' || pathname === '/properties' || pathname.startsWith('/investor/') || pathname.startsWith('/project/');

  const displayUser = isDashboardArea ? user : null;

  const getNavLinks = () => {
    if (!displayUser) {
      return [
        { label: 'Home', path: '/' },
        { label: 'Builder', path: '/builder' },
        { label: 'About Us', path: '/about-us' },
        { label: 'Gallery', path: '/gallery' },
        { label: 'Contact Us', path: '/contact-us' },
      ];
    }
    switch (displayUser.role) {
      case 'admin': return [{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Builders', path: '/admin/builders' }, { label: 'Investors', path: '/admin/investors' }, { label: 'Projects', path: '/admin/projects' }, { label: 'Leads', path: '/admin/leads' }, { label: 'Inquiries', path: '/admin/inquiries' }, { label: 'Helpdesk', path: '/admin/helpdesk' }, { label: 'Newsletter', path: '/admin/newsletter' }, { label: 'Advertisements', path: '/admin/advertisements' }];
      case 'builder': return [{ label: 'Dashboard', path: '/builder/dashboard' }, { label: 'Projects', path: '/builder/projects' }, { label: 'Advertise', path: '/builder/advertisements' }];
      case 'investor': return [{ label: 'Dashboard', path: '/dashboard' }, { label: 'Properties', path: '/properties' }];
      default: return [{ label: 'Home', path: '/' }];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      <header className={`fixed w-full top-0 left-0 right-0 z-[1000] transition-all duration-300 bg-[#232325] border-b border-gray-800 text-gray-300`}>
        <div className="h-16 flex items-center justify-between mx-4">
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center">
              <img src="/logo-big.png" alt="LOGO" className="hidden md:block h-14 w-auto object-contain" />
              <img src="/logo-small-white.png" alt="LOGO" className="block md:hidden h-14 w-auto object-contain" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center flex-1 px-4 overflow-hidden">
            <ul className="flex items-center justify-center w-full text-sm lg:text-base font-medium text-gray-400">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.path;
                return (
                  <React.Fragment key={link.label}>
                    <li><Link href={link.path} className={`transition-colors px-2 lg:px-4 py-2 block mx-1 lg:mx-2 xl:mx-3 text-nowrap ${isActive ? 'text-[#D48035]' : 'hover:text-[#D48035]'}`}>{link.label}</Link></li>
                    {index < navLinks.length - 1 && <span className="text-gray-700 select-none">|</span>}
                  </React.Fragment>
                )
              })}
            </ul>
          </nav>

          {/* Desktop Auth Actions */}
          {displayUser ? (
            <div className="hidden md:flex items-center gap-3 mr-4 shrink-0">
              <Link href={getDashboardPath(displayUser.role)} className="flex items-center gap-2 text-xs font-bold bg-gray-800/60 px-4.5 py-2 rounded-full border border-gray-700/50 text-gray-200 shadow-inner hover:bg-gray-700 transition-all">
                <UserCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span className="max-w-[120px] truncate">{displayUser.name || displayUser.email.split('@')[0]}</span>
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

          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300 hover:text-white">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div className={`md:hidden fixed inset-0 top-16 bg-[#232325] z-40 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full p-6 overflow-y-auto text-gray-300">
            <div className="space-y-1 mb-8">
              {navLinks.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link key={item.label} href={item.path} onClick={() => setMobileMenuOpen(false)} className={`block py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors ${isActive ? 'text-[#D48035]' : 'text-gray-300 hover:text-[#D48035]'}`}>{item.label}</Link>
                )
              })}
            </div>

            <div className="mt-auto pb-8">
              {displayUser ? (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-800 rounded mb-4">
                    <p className="text-xs text-gray-400">Account</p>
                    <p className="text-white font-medium">{displayUser.email}</p>
                  </div>
                  <Button onClick={() => { router.push(getDashboardPath(displayUser.role)); setMobileMenuOpen(false); }} className="w-full bg-[#D48035] hover:bg-[#B45309] text-white flex items-center justify-center gap-2"><LayoutDashboard className="w-4 h-4" /> Go to Dashboard</Button>
                  <Button onClick={handleLogout} variant="destructive" className="w-full"><LogOut className="w-4 h-4 mr-2" /> Logout</Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button onClick={() => handleAuthClick('login', 'investor')} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-6">Login/Register as an Investor</Button>
                  <Button onClick={() => handleAuthClick('login', 'builder')} className="w-full bg-[var(--color-accent,#D48035)] hover:bg-[var(--color-accent-hover,#B45309)] text-white py-6">Login/Register as a Builder</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginDialog
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onSwitchToRegister={handleSwitchToRegister}
        initialData={dialogData}
      />

      <RegisterDialog
        isOpen={isRegisterOpen}
        onOpenChange={setIsRegisterOpen}
        onLoginClick={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
        initialData={dialogData}
      />
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