import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#0a1f44] text-gray-200 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-sky-400">Life Insurance Co.</h3>
          <p className="text-gray-300">
            We provide trusted life insurance solutions to secure your future. Join our newsletter or contact us for more information.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-sky-400">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-sky-300 transition">Home</a></li>
            <li><a href="/AllPolicies" className="hover:text-sky-300 transition">Policies</a></li>
            <li><a href="/blog" className="hover:text-sky-300 transition">Blogs</a></li>
            <li><a href="/aboutus" className="hover:text-sky-300 transition">About us</a></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-sky-400">Contact Us</h3>
          <p className="text-gray-300 mb-4">123 Insurance St, Dhaka, Bangladesh</p>
          <p className="text-gray-300 mb-4">Email: info@lifeinsurance.com</p>
          <div className="flex space-x-4 mt-2">
            <a href="https://www.facebook.com/hm.rana.161" className="p-2 rounded-full bg-sky-600 text-white hover:bg-sky-500 transition"><FaFacebookF /></a>
            <a href="https://www.linkedin.com/in/mohammad-masum-hossain/" className="p-2 rounded-full bg-sky-600 text-white hover:bg-sky-500 transition"><FaLinkedinIn /></a>
          </div>
        </div>

      </div>

      {/* Bottom copyright */}
      <div className="mt-10 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Life Insurance Co. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
