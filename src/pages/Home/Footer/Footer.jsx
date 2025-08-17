import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 pt-12 pb-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-sky-800">Life Insurance Co.</h3>
          <p className="text-gray-600">
            We provide trusted life insurance solutions to secure your future. Join our newsletter or contact us for more information.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-sky-800">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-sky-600 transition">Home</a></li>
            <li><a href="/AllPolicies" className="hover:text-sky-600 transition">Policies</a></li>
             <li><a href="/blog" className="hover:text-sky-600 transition">Blogs</a></li>
             <li><a href="/aboutus" className="hover:text-sky-600 transition">About us</a></li>
            
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-sky-800">Contact Us</h3>
          <p className="text-gray-600 mb-4">123 Insurance St, Dhaka, Bangladesh</p>
          <p className="text-gray-600 mb-4">Email: info@lifeinsurance.com</p>
          <div className="flex space-x-4 mt-2">
            <a href="https://www.facebook.com/hm.rana.161" className="p-2 rounded-full bg-sky-600 text-white hover:bg-sky-700 transition"><FaFacebookF /></a>
            <a href="https://www.linkedin.com/in/mohammad-masum-hossain/" className="p-2 rounded-full bg-sky-600 text-white hover:bg-sky-700 transition"><FaLinkedinIn /></a>
          </div>
        </div>

      </div>

      {/* Bottom copyright */}
      <div className="mt-10 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Life Insurance Co. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
