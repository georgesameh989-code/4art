import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { motion } from 'motion/react';
import { ShoppingBag, Search, Filter } from 'lucide-react';

interface Product {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  image: string;
}

const Store = () => {
  const { lang } = useSite();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-site-text">
              {lang === 'ar' ? 'متجرنا وأعمالنا' : 'Our Store & Works'}
            </h1>
            <p className="text-gray-500 mt-2">
              {lang === 'ar' ? 'استعرض أحدث منتجاتنا وخدماتنا الإعلانية.' : 'Browse our latest advertising products and services.'}
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder={lang === 'ar' ? 'بحث...' : 'Search...'} 
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 w-full md:w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              <span>{lang === 'ar' ? 'تصفية' : 'Filter'}</span>
            </button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {lang === 'ar' ? 'لا توجد منتجات حالياً.' : 'No products available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name_en} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-primary">
                    ${product.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                    {lang === 'ar' ? product.name_ar : product.name_en}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                    {lang === 'ar' ? product.description_ar : product.description_en}
                  </p>
                  <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-primary transition-colors flex items-center justify-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
