import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewsletterSubscription = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('https://life-insurance-server-three.vercel.app/newsletter', formData);
      toast.success('Thank you for subscribing!');
      setFormData({ name: '', email: '' });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error('Failed to subscribe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-sky-50 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Subscribe to our Newsletter</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="border border-gray-300 px-3 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
          className="border border-gray-300 px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded transition"
        >
          {loading ? 'Submitting...' : 'Subscribe'}
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default NewsletterSubscription;
