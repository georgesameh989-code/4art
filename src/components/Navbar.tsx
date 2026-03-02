import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { Menu, X, Globe, User, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const { settings, user, lang, setLang, logout } = useSite();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name_ar: 'الرئيسية', name_en: 'Home', path: '/' },
    { name_ar: 'من نحن', name_en: 'About', path: '/about' },
    { name_ar: 'المتجر', name_en: 'Store', path: '/store' },
    { name_ar: 'اتصل بنا', name_en: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-10 w-auto" src={settings?.logo} alt="Logo" />
              <span className="ml-2 text-xl font-bold text-primary">
                {lang === 'ar' ? settings?.siteName_ar : settings?.siteName_en}
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-site-text hover:text-primary transition-colors font-medium"
              >
                {lang === 'ar' ? link.name_ar : link.name_en}
              </Link>
            ))}
            
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center text-site-text hover:text-primary transition-colors"
            >
              <Globe className="w-5 h-5 mr-1 rtl:ml-1" />
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>

            {user ? (
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-site-text hover:text-primary">
                    <Settings className="w-5 h-5" />
                  </Link>
                )}
                <button onClick={logout} className="text-red-500 hover:text-red-700">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-primary hover:text-secondary font-bold">
                <User className="w-5 h-5 inline-block mr-1 rtl:ml-1" />
                {lang === 'ar' ? 'دخول' : 'Login'}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-site-text hover:text-primary focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-site-text hover:bg-gray-50 hover:text-primary"
                >
                  {lang === 'ar' ? link.name_ar : link.name_en}
                </Link>
              ))}
              <button
                onClick={() => {
                  setLang(lang === 'ar' ? 'en' : 'ar');
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-site-text hover:bg-gray-50 hover:text-primary flex items-center"
              >
                <Globe className="w-5 h-5 mr-2 rtl:ml-2" />
                {lang === 'ar' ? 'English' : 'العربية'}
              </button>
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-site-text hover:bg-gray-50 hover:text-primary"
                    >
                      {lang === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50"
                  >
                    {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-gray-50"
                >
                  {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
