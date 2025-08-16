import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router'; // Correct import

const fetchPopularPolicies = async () => {
  const { data } = await axios.get('https://life-insurance-server-three.vercel.app/policies');
  return data.data; // return the array of policies here
};

const PopularPolicies = () => {
  const { data: policies = [], isLoading, isError } = useQuery({
    queryKey: ['popularPolicies'],
    queryFn: fetchPopularPolicies,
  });

  if (isLoading) return <p className="text-center">Loading policies...</p>;
  if (isError) return <p className="text-center text-red-500">Failed to load policies.</p>;

  return (
    <div className="my-10 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center">Popular Policies</h2>

      {/* Responsive grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {policies.slice(0, 6).map((policy) => (
          <div
            key={policy._id}
            className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col transition-transform hover:scale-[1.02]"
          >
            {/* Image */}
            {/* <div className="w-full aspect-[16/9] bg-gray-100">
              <img
                src={policy.image || 'https://via.placeholder.com/500x300?text=No+Image'}
                alt={policy.title}
                className="w-full h-full object-cover"
              />
            </div> */}
           <div className="w-full h-48 bg-gray-100 overflow-hidden">
  <img
    src={policy.image || 'https://via.placeholder.com/500x300?text=No+Image'}
    alt={policy.title}
    className="w-full object-contain object-top"
  />
</div>



            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-3">{policy.title}</h3>
                <p className="mb-1"><strong>Coverage:</strong> ${policy.coverageAmount}</p>
                <p className="mb-1"><strong>Term:</strong> {policy.termDuration} years</p>
                <p><strong>Popularity:</strong> {policy.popularity} purchases</p>
              </div>

              <div className="mt-5">
                <Link
                  to={`/policies/${policy._id}`}
                  className="block text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularPolicies;
