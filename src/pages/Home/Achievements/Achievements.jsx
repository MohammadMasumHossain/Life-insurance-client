import { useEffect, useState } from "react";
import { FaUsers, FaAward, FaBriefcase, FaGlobe } from "react-icons/fa";

const Achievements = () => {
  const stats = [
    { id: 1, title: "Happy Clients", value: 1500, icon: <FaUsers className="w-10 h-10 text-sky-600 mb-2" /> },
    { id: 2, title: "Policies Issued", value: 3200, icon: <FaBriefcase className="w-10 h-10 text-sky-600 mb-2" /> },
    { id: 3, title: "Awards Won", value: 12, icon: <FaAward className="w-10 h-10 text-sky-600 mb-2" /> },
    { id: 4, title: "Countries Served", value: 8, icon: <FaGlobe className="w-10 h-10 text-sky-600 mb-2" /> },
  ];

  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts(prev =>
        prev.map((count, i) => {
          if (count < stats[i].value) return count + Math.ceil(stats[i].value / 100);
          return stats[i].value;
        })
      );
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white py-16 px-6">
      <h2 className="text-4xl font-extrabold text-center text-black mb-12 tracking-wide">
        Our Achievements
      </h2>
      <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className="bg-gray-50 rounded-xl shadow-lg p-8 flex flex-col items-center text-center transform transition-transform hover:scale-105 hover:shadow-2xl"
          >
            {stat.icon}
            <h3 className="text-3xl font-bold text-black mb-2">{counts[index]}</h3>
            <p className="text-gray-700">{stat.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Achievements;
