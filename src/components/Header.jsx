"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Menu, X, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/AuthContext';
import LoginDialog from '@/components/LoginDialog';
import RegisterDialog from '@/components/RegisterDialog';

const Header = ({ transparent = false }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

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

  const getNavLinks = () => {
    if (!user) {
      return [
        { label: 'Home', path: '/' },
        { label: 'Builder', path: '/builder' },
        { label: 'About Us', path: '/about-us' },
        { label: 'Contact Us', path: '/contact-us' },
      ];
    }
    switch (user.role) {
      case 'admin': return [{ label: 'Dashboard', path: '/admin/dashboard' }, { label: 'Builders', path: '/admin/builders' }, { label: 'Investors', path: '/admin/investors' }, { label: 'Projects', path: '/admin/projects' }, { label: 'Leads', path: '/admin/leads' }, { label: 'Inquiries', path: '/admin/inquiries' }, { label: 'Newsletter', path: '/admin/newsletter' }];
      case 'builder': return [{ label: 'Dashboard', path: '/partner/dashboard' }, { label: 'Projects', path: '/partner/projects' }];
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

          <nav className="hidden md:flex items-center flex-1">
            <ul className="flex items-center justify-center w-full text-md font-medium text-gray-400">
              {navLinks.map((link, index) => (
                <React.Fragment key={link.label}>
                  <li><Link href={link.path} className="hover:text-white transition-colors px-3 lg:px-5 py-2 block mx-4">{link.label}</Link></li>
                  {index < navLinks.length - 1 && <span className="text-gray-700 select-none">|</span>}
                </React.Fragment>
              ))}
            </ul>
          </nav>



          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300 hover:text-white">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div className={`md:hidden fixed inset-0 top-16 bg-[#232325] z-40 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full p-6 overflow-y-auto text-gray-300">
            <div className="space-y-1 mb-8">
              {navLinks.map((item) => (
                <Link key={item.label} href={item.path} onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 rounded-xl font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">{item.label}</Link>
              ))}
            </div>

            <div className="mt-auto pb-8">
              {user ? (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-800 rounded mb-4">
                    <p className="text-xs text-gray-400">Account</p>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                  <Button onClick={handleLogout} variant="destructive" className="w-full"><LogOut className="w-4 h-4 mr-2" /> Logout</Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button onClick={() => handleAuthClick('login', 'investor')} className="w-full bg-gray-800 hover:bg-gray-700 text-white py-6">Login/Register as an Investor</Button>
                  <Button onClick={() => handleAuthClick('login', 'builder')} className="w-full bg-[var(--color-accent,#D48035)] hover:bg-[var(--color-accent-hover,#B45309)] text-white py-6">Login/Register as a Partner</Button>
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

export default Header;