import { FaChartPie, FaHandsHelping, FaMoneyCheckAlt, FaUserShield, FaHeadset, FaLaptop } from 'react-icons/fa';

const OurServices = () => {
  const services = [
    {
      title: 'Financial Planning',
      description: 'Get expert advice to manage and grow your wealth effectively.',
      icon: <FaChartPie className="text-sky-600 w-16 h-16 mb-6" />,
    },
    {
      title: 'Claim Assistance',
      description: 'We help you navigate claims smoothly and quickly.',
      icon: <FaHandsHelping className="text-sky-600 w-16 h-16 mb-6" />,
    },
    {
      title: 'Premium Management',
      description: 'Flexible and convenient payment options for your premiums.',
      icon: <FaMoneyCheckAlt className="text-sky-600 w-16 h-16 mb-6" />,
    },
    {
      title: 'Risk Assessment',
      description: 'Personalized advice to determine the right coverage for you.',
      icon: <FaUserShield className="text-sky-600 w-16 h-16 mb-6" />,
    },
    {
      title: 'Customer Support',
      description: '24/7 dedicated support for all your queries.',
      icon: <FaHeadset className="text-sky-600 w-16 h-16 mb-6" />,
    },
    {
      title: 'Online Portal Access',
      description: 'Secure online access to your policy documents and updates.',
      icon: <FaLaptop className="text-sky-600 w-16 h-16 mb-6" />,
    },
  ];

  return (
    <section className="bg-white py-16 px-6">
      <h2 className="text-4xl font-extrabold text-center text-sky-800 mb-12 tracking-wide">Our Services</h2>
      <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl transition-transform hover:scale-105"
          >
            {service.icon}
            <h3 className="text-2xl font-semibold text-black mb-2">{service.title}</h3>
            <p className="text-gray-700">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurServices;
