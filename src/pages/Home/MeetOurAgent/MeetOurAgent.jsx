import { useEffect, useState } from 'react';
import axios from 'axios';

const MeetOurAgent = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/agents')
      .then(res => {
        setAgents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load agents.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center py-10 text-sky-700 font-semibold">Loading agents...</p>;
  if (error) return <p className="text-center py-10 text-red-600 font-semibold">{error}</p>;

  return (
    <section className="bg-sky-100 py-16 px-6 ">
      <h2 className="text-5xl font-extrabold text-center text-sky-800 mb-12 tracking-wide">Meet Our Agents</h2>
      <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {agents.map(agent => (
          <div
            key={agent._id}
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center transition-transform hover:scale-105 hover:shadow-2xl"
          >
            <img
              src={agent.photo || 'https://i.ibb.co/yF4ZtCW/default-user.png'}
              alt={agent.name}
              className="w-36 h-36 rounded-full object-cover mb-6 border-4 border-sky-400"
            />
            <h3 className="text-2xl font-semibold text-sky-900 mb-2">{agent.name}</h3>
            {/* You can add experience or specialties here if available */}
            <p className="text-sky-700 font-medium mb-1">
              {agent.experience ? `${agent.experience} years experience` : ''}
            </p>
            <p className="text-sky-600 italic">{agent.specialties ? agent.specialties.join(', ') : 'Specialties not listed'}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MeetOurAgent;
