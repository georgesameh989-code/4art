import React from 'react';
import { useSite } from '../context/SiteContext';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { settings, lang } = useSite();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Info */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">
              {lang === 'ar' ? settings?.siteName_ar : settings?.siteName_en}
            </h3>
            <p className="text-gray-400 mb-6">
              {lang === 'ar' ? settings?.heroSub_ar : settings?.heroSub_en}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Facebook /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Twitter /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Instagram /></a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Linkedin /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-primary transition-colors">{lang === 'ar' ? 'الرئيسية' : 'Home'}</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-primary transition-colors">{lang === 'ar' ? 'من نحن' : 'About Us'}</a></li>
              <li><a href="/store" className="text-gray-400 hover:text-primary transition-colors">{lang === 'ar' ? 'المتجر' : 'Store'}</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-primary transition-colors">{lang === 'ar' ? 'اتصل بنا' : 'Contact'}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{lang === 'ar' ? 'معلومات التواصل' : 'Contact Info'}</h4>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-400">
                <Mail className="w-5 h-5 mr-3 rtl:ml-3 text-primary" />
                <span>{settings?.contactEmail}</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="w-5 h-5 mr-3 rtl:ml-3 text-primary" />
                <span>{settings?.contactPhone}</span>
              </li>
              <li className="flex items-center text-gray-400">
                <MapPin className="w-5 h-5 mr-3 rtl:ml-3 text-primary" />
                <span>{lang === 'ar' ? settings?.address_ar : settings?.address_en}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} {lang === 'ar' ? settings?.siteName_ar : settings?.siteName_en}. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
