import React from 'react';
import { useSite } from '../context/SiteContext';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const { settings, lang } = useSite();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [submitted, setSubmitted] = React.useState(false);

  const onSubmit = async (data: any) => {
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-site-text mb-4">
            {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            {lang === 'ar' ? 'نحن هنا للإجابة على استفساراتكم ومساعدتكم في تحقيق أهدافكم.' : 'We are here to answer your inquiries and help you achieve your goals.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-6">
              <div className="bg-primary/10 p-4 rounded-xl text-primary"><Mail /></div>
              <div>
                <h3 className="font-bold text-lg mb-1">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</h3>
                <p className="text-gray-500">{settings?.contactEmail}</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-6">
              <div className="bg-primary/10 p-4 rounded-xl text-primary"><Phone /></div>
              <div>
                <h3 className="font-bold text-lg mb-1">{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</h3>
                <p className="text-gray-500">{settings?.contactPhone}</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-6">
              <div className="bg-primary/10 p-4 rounded-xl text-primary"><MapPin /></div>
              <div>
                <h3 className="font-bold text-lg mb-1">{lang === 'ar' ? 'العنوان' : 'Address'}</h3>
                <p className="text-gray-500">{lang === 'ar' ? settings?.address_ar : settings?.address_en}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
              {submitted ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold mb-2">
                    {lang === 'ar' ? 'تم الإرسال بنجاح!' : 'Sent Successfully!'}
                  </h2>
                  <p className="text-gray-500">
                    {lang === 'ar' ? 'شكراً لتواصلك معنا، سنقوم بالرد عليك في أقرب وقت ممكن.' : 'Thank you for contacting us, we will get back to you as soon as possible.'}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {lang === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                      </label>
                      <input 
                        {...register('name', { required: true })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:outline-none"
                      />
                      {errors.name && <span className="text-red-500 text-xs">{lang === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required'}</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                      </label>
                      <input 
                        type="email"
                        {...register('email', { required: true })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:outline-none"
                      />
                      {errors.email && <span className="text-red-500 text-xs">{lang === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required'}</span>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {lang === 'ar' ? 'الرسالة' : 'Message'}
                    </label>
                    <textarea 
                      rows={6}
                      {...register('message', { required: true })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:outline-none"
                    ></textarea>
                    {errors.message && <span className="text-red-500 text-xs">{lang === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required'}</span>}
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-secondary transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                    {isSubmitting ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...') : (lang === 'ar' ? 'إرسال الرسالة' : 'Send Message')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
