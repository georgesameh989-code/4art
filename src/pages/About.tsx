import React from 'react';
import { useSite } from '../context/SiteContext';
import { motion } from 'motion/react';
import { Target, Eye, Award } from 'lucide-react';

const About = () => {
  const { settings, lang } = useSite();

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-site-text mb-6">
              {lang === 'ar' ? 'من نحن' : 'About Us'}
            </h2>
            <div className="w-20 h-1 bg-primary mb-8"></div>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {lang === 'ar' ? settings?.aboutText_ar : settings?.aboutText_en}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="bg-primary/10 p-3 rounded-lg"><Award className="text-primary" /></div>
                <span className="font-bold">{lang === 'ar' ? 'خبرة 10 سنوات' : '10 Years Experience'}</span>
              </div>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="bg-primary/10 p-3 rounded-lg"><Award className="text-primary" /></div>
                <span className="font-bold">{lang === 'ar' ? 'أكثر من 500 عميل' : '500+ Clients'}</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src="https://picsum.photos/seed/about/600/400" 
              alt="About 4art" 
              className="rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary text-white p-8 rounded-2xl hidden md:block">
              <p className="text-3xl font-bold">100%</p>
              <p className="text-sm opacity-80">{lang === 'ar' ? 'رضا العملاء' : 'Customer Satisfaction'}</p>
            </div>
          </motion.div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="text-primary w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">{lang === 'ar' ? 'رسالتنا' : 'Our Mission'}</h3>
            <p className="text-gray-600">
              {lang === 'ar' ? 'تقديم حلول إبداعية تساعد الشركات على النمو والتميز في سوق تنافسي.' : 'Providing creative solutions that help companies grow and excel in a competitive market.'}
            </p>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Eye className="text-primary w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">{lang === 'ar' ? 'رؤيتنا' : 'Our Vision'}</h3>
            <p className="text-gray-600">
              {lang === 'ar' ? 'أن نكون الخيار الأول للشركات الباحثة عن الإبداع والتميز في الشرق الأوسط.' : 'To be the first choice for companies seeking creativity and excellence in the Middle East.'}
            </p>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="text-primary w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">{lang === 'ar' ? 'قيمنا' : 'Our Values'}</h3>
            <p className="text-gray-600">
              {lang === 'ar' ? 'الابتكار، الجودة، الالتزام، والشفافية في كل ما نقدمه.' : 'Innovation, quality, commitment, and transparency in everything we offer.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
