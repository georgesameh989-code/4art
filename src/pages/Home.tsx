import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { settings, lang } = useSite();
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderImages = settings?.sliderImages ? JSON.parse(settings.sliderImages) : [];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderImages.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);

  const services = [
    {
      title_ar: 'تصميم الهوية البصرية',
      title_en: 'Visual Identity Design',
      desc_ar: 'نصمم شعارات وهويات تعبر عن روح علامتك التجارية.',
      desc_en: 'We design logos and identities that express your brand spirit.',
      icon: <Star className="w-10 h-10 text-primary" />
    },
    {
      title_ar: 'التسويق الرقمي',
      title_en: 'Digital Marketing',
      desc_ar: 'نصل بمنتجاتك إلى جمهورك المستهدف بدقة واحترافية.',
      desc_en: 'We reach your target audience with precision and professionalism.',
      icon: <CheckCircle className="w-10 h-10 text-primary" />
    },
    {
      title_ar: 'إنتاج المحتوى',
      title_en: 'Content Production',
      desc_ar: 'كتابة محتوى إبداعي وتصوير احترافي لمنتجاتك.',
      desc_en: 'Creative content writing and professional photography for your products.',
      icon: <ArrowRight className="w-10 h-10 text-primary" />
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Slider */}
      <section className="relative h-[600px] bg-gray-900">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={sliderImages[currentSlide]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              {lang === 'ar' ? settings?.heroTitle_ar : settings?.heroTitle_en}
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              {lang === 'ar' ? settings?.heroSub_ar : settings?.heroSub_en}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/store" className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105">
                {lang === 'ar' ? 'استكشف أعمالنا' : 'Explore Our Work'}
              </Link>
              <Link to="/contact" className="bg-white hover:bg-gray-100 text-primary px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105">
                {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </Link>
            </div>
          </motion.div>
        </div>

        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white transition-all">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white transition-all">
          <ChevronRight className="w-8 h-8" />
        </button>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-site-text mb-4">
              {lang === 'ar' ? 'خدماتنا المتميزة' : 'Our Premium Services'}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100"
              >
                <div className="mb-6 flex justify-center">{service.icon}</div>
                <h3 className="text-xl font-bold mb-4">
                  {lang === 'ar' ? service.title_ar : service.title_en}
                </h3>
                <p className="text-gray-600">
                  {lang === 'ar' ? service.desc_ar : service.desc_en}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {lang === 'ar' ? 'هل أنت مستعد لبدء مشروعك القادم؟' : 'Ready to start your next project?'}
          </h2>
          <p className="text-xl mb-10 opacity-90">
            {lang === 'ar' ? 'دعنا نساعدك في تحويل أفكارك إلى واقع ملموس.' : 'Let us help you turn your ideas into reality.'}
          </p>
          <Link to="/contact" className="bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all">
            {lang === 'ar' ? 'ابدأ الآن' : 'Get Started Now'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
