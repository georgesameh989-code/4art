import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { motion } from 'motion/react';
import { 
  Settings, 
  Package, 
  MessageSquare, 
  Layout, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Image as ImageIcon,
  Languages
} from 'lucide-react';

const Admin = () => {
  const { settings, refreshSettings, lang, translate } = useSite();
  const [activeTab, setActiveTab] = useState('settings');
  const [formData, setFormData] = useState<any>({});
  const [products, setProducts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (settings) setFormData(settings);
  }, [settings]);

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'messages') fetchMessages();
  }, [activeTab]);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const fetchMessages = async () => {
    const res = await fetch('/api/messages', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setMessages(data);
  };

  const handleSettingChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveSettings = async () => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData)
    });
    await refreshSettings();
    alert('Settings saved successfully!');
  };

  const handleProductSubmit = async (e: any) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const product = Object.fromEntries(data.entries());
    
    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(product)
    });
    setEditingProduct(null);
    e.target.reset();
    fetchProducts();
  };

  const deleteProduct = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    fetchProducts();
  };

  const autoTranslate = async (field: string, targetField: string) => {
    if (!formData[field]) return;
    setIsTranslating(true);
    const translated = await translate(formData[field]);
    setFormData({ ...formData, [targetField]: translated });
    setIsTranslating(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg hidden md:block">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-primary">Admin Panel</h2>
        </div>
        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button 
            onClick={() => setActiveTab('content')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'content' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
          >
            <Layout className="w-5 h-5" />
            <span>Content</span>
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
          >
            <Package className="w-5 h-5" />
            <span>Products</span>
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'messages' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Messages</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'settings' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Site Settings</h2>
                <button onClick={saveSettings} className="bg-primary text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-secondary transition-all">
                  <Save className="w-5 h-5" /> Save Changes
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Color</label>
                  <input type="color" name="primaryColor" value={formData.primaryColor} onChange={handleSettingChange} className="w-full h-12 rounded-xl cursor-pointer" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Secondary Color</label>
                  <input type="color" name="secondaryColor" value={formData.secondaryColor} onChange={handleSettingChange} className="w-full h-12 rounded-xl cursor-pointer" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Background Color</label>
                  <input type="color" name="backgroundColor" value={formData.backgroundColor} onChange={handleSettingChange} className="w-full h-12 rounded-xl cursor-pointer" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Text Color</label>
                  <input type="color" name="textColor" value={formData.textColor} onChange={handleSettingChange} className="w-full h-12 rounded-xl cursor-pointer" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Logo URL</label>
                  <input type="text" name="logo" value={formData.logo} onChange={handleSettingChange} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Site Name (AR)</label>
                  <input type="text" name="siteName_ar" value={formData.siteName_ar} onChange={handleSettingChange} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Site Name (EN)</label>
                  <input type="text" name="siteName_en" value={formData.siteName_en} onChange={handleSettingChange} className="w-full px-4 py-2 border rounded-xl" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Content Management</h2>
                <button onClick={saveSettings} className="bg-primary text-white px-6 py-2 rounded-xl flex items-center gap-2">
                  <Save className="w-5 h-5" /> Save Changes
                </button>
              </div>

              <div className="space-y-8">
                <div className="p-6 bg-gray-50 rounded-2xl border">
                  <h3 className="font-bold mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Hero Section</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Hero Title (AR)</label>
                      <div className="flex gap-2">
                        <input type="text" name="heroTitle_ar" value={formData.heroTitle_ar} onChange={handleSettingChange} className="flex-grow px-4 py-2 border rounded-xl" />
                        <button onClick={() => autoTranslate('heroTitle_ar', 'heroTitle_en')} className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200"><Languages /></button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Hero Title (EN)</label>
                      <input type="text" name="heroTitle_en" value={formData.heroTitle_en} onChange={handleSettingChange} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border">
                  <h3 className="font-bold mb-4 flex items-center gap-2">About Section</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">About Text (AR)</label>
                      <div className="flex gap-2">
                        <textarea name="aboutText_ar" value={formData.aboutText_ar} onChange={handleSettingChange} rows={4} className="flex-grow px-4 py-2 border rounded-xl"></textarea>
                        <button onClick={() => autoTranslate('aboutText_ar', 'aboutText_en')} className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 h-fit"><Languages /></button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">About Text (EN)</label>
                      <textarea name="aboutText_en" value={formData.aboutText_en} onChange={handleSettingChange} rows={4} className="w-full px-4 py-2 border rounded-xl"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" name="name_ar" defaultValue={editingProduct?.name_ar} placeholder="Name (AR)" required className="px-4 py-2 border rounded-xl" />
                  <input type="text" name="name_en" defaultValue={editingProduct?.name_en} placeholder="Name (EN)" required className="px-4 py-2 border rounded-xl" />
                  <textarea name="description_ar" defaultValue={editingProduct?.description_ar} placeholder="Description (AR)" className="md:col-span-2 px-4 py-2 border rounded-xl"></textarea>
                  <textarea name="description_en" defaultValue={editingProduct?.description_en} placeholder="Description (EN)" className="md:col-span-2 px-4 py-2 border rounded-xl"></textarea>
                  <input type="number" step="0.01" name="price" defaultValue={editingProduct?.price} placeholder="Price" required className="px-4 py-2 border rounded-xl" />
                  <input type="text" name="image" defaultValue={editingProduct?.image} placeholder="Image URL" required className="px-4 py-2 border rounded-xl" />
                  <div className="md:col-span-2 flex gap-4">
                    <button type="submit" className="flex-grow bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                      {editingProduct ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                    {editingProduct && (
                      <button type="button" onClick={() => setEditingProduct(null)} className="px-6 bg-gray-200 rounded-xl">Cancel</button>
                    )}
                  </div>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border flex gap-4 items-center">
                    <img src={p.image} className="w-20 h-20 object-cover rounded-xl" />
                    <div className="flex-grow">
                      <h4 className="font-bold">{p.name_en}</h4>
                      <p className="text-sm text-gray-500">${p.price}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => setEditingProduct(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-8">Contact Messages</h2>
              <div className="space-y-6">
                {messages.map(m => (
                  <div key={m.id} className="p-6 bg-gray-50 rounded-2xl border">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg">{m.name}</h4>
                        <p className="text-sm text-gray-500">{m.email}</p>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{m.message}</p>
                  </div>
                ))}
                {messages.length === 0 && <p className="text-center text-gray-500">No messages yet.</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
