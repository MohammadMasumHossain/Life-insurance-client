import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaStar } from 'react-icons/fa';
import useAuth from '../../../../hooks/useAuth';

const MyPolicy = () => {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Function to calculate premium (simple example)
  const calculatePremium = (coverageAmount, termDuration) => {
    if (!coverageAmount || !termDuration) return 0;
    // termDuration like "15 years" → extract number
    const years = parseInt(termDuration);
    if (isNaN(years) || years === 0) return 0;
    // For example, premium = coverageAmount / (years * 10)
    return Math.round(coverageAmount / (years * 10));
  };

  // Fetch applied policies
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:3000/applications?email=${user.email}`)
        .then((res) => setPolicies(res.data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  const openModal = (policy) => {
    setSelectedPolicy(policy);
    setRating(0);
    setFeedback('');
    setShowModal(true);
  };

  const handleSubmitReview = async () => {
  if (!rating || !feedback.trim()) {
    return Swal.fire('Error', 'Please provide both rating and feedback.', 'error');
  }

  const review = {
    email: user.email,
    name: user.displayName || 'Anonymous',
    photo: user.photoURL || 'https://i.ibb.co/ZYW3VTp/brown-brim.png',
    policyId: selectedPolicy._id,
    policyTitle: selectedPolicy.policyType,
    rating,
    feedback,
  };

  try {
    await axios.post('http://localhost:3000/reviews', review);
    Swal.fire('Success', 'Review submitted successfully!', 'success');
    setShowModal(false);
  } catch (err) {
    console.error(err);
    Swal.fire('Error', 'Failed to submit review.', 'error');
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-blue-800">
          My Applied Policies
        </h2>

        <div className="overflow-x-auto shadow-lg rounded-lg bg-white p-4">
          <table className="table w-full text-sm">
            <thead className="bg-blue-100 text-blue-800 font-semibold">
              <tr>
                <th>No</th>
                <th>Policy Type</th>
                <th>Coverage</th>
                <th>Duration</th>
                <th>Premium</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy, index) => (
                <tr key={policy._id} className="hover:bg-blue-50 transition">
                  <td>{index + 1}</td>
                  <td className="font-medium">{policy.policyType}</td>
                  <td>{policy.coverageAmount?.toLocaleString()} ৳</td>
                  <td>{policy.termDuration}</td>
                  <td>{calculatePremium(policy.coverageAmount, policy.termDuration).toLocaleString()} ৳</td>
                  <td>
                    <span
                      className={`badge px-3 py-1 text-white ${
                        policy.status === 'Approved'
                          ? 'bg-green-500'
                          : policy.status === 'Rejected'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      }`}
                    >
                      {policy.status}
                    </span>
                  </td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => {
                        const hc =
                          policy.healthConditions && policy.healthConditions.length
                            ? policy.healthConditions.join(', ')
                            : 'None';

                        Swal.fire({
                          title: policy.policyType,
                          html: `
                            <b>Full Name:</b> ${policy.fullName || 'N/A'}<br/>
                            <b>Email:</b> ${policy.email || 'N/A'}<br/>
                            <b>Address:</b> ${policy.address || 'N/A'}<br/>
                            <b>Phone Number:</b> ${policy.phoneNumber || 'N/A'}<br/>
                            <b>Date of Birth:</b> ${
                              policy.dateOfBirth
                                ? new Date(policy.dateOfBirth).toLocaleDateString()
                                : 'N/A'
                            }<br/>
                            <b>NID:</b> ${policy.nid || 'N/A'}<br/><br/>

                            <b>Nominee Name:</b> ${policy.nomineeName || 'N/A'}<br/>
                            <b>Nominee Relationship:</b> ${policy.nomineeRelationship || 'N/A'}<br/>
                            <b>Nominee NID:</b> ${policy.nomineeNID || 'N/A'}<br/><br/>

                            <b>Health Conditions:</b> ${hc}<br/><br/>

                            <b>Policy Type:</b> ${policy.policyType || 'N/A'}<br/>
                            <b>Coverage:</b> ${policy.coverageAmount?.toLocaleString() || 'N/A'} ৳<br/>
                            <b>Term Duration:</b> ${policy.termDuration || 'N/A'}<br/>
                            <b>Estimated Premium:</b> ${calculatePremium(
                              policy.coverageAmount,
                              policy.termDuration
                            ).toLocaleString()} ৳<br/>
                            <b>Status:</b> ${policy.status || 'N/A'}<br/>
                            <b>Submitted At:</b> ${
                              policy.submittedAt
                                ? new Date(policy.submittedAt).toLocaleString()
                                : 'N/A'
                            }
                          `,
                          confirmButtonText: 'Close',
                          width: '600px',
                          customClass: {
                            popup: 'text-left text-blue-800',
                          },
                        });
                      }}
                      className="btn btn-xs btn-info"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => openModal(policy)}
                      className="btn btn-xs btn-secondary"
                    >
                      Give Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-blue-100 p-6 rounded-xl shadow-2xl w-full max-w-md relative">
            <h3 className="text-2xl font-semibold mb-4 text-blue-800">
              Review: {selectedPolicy?.policyType}
            </h3>

            <div className="mb-4">
              <label className="block mb-1 text-blue-700 font-medium">Star Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer text-2xl transition ${
                      rating >= star ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-blue-700 font-medium">Feedback</label>
              <textarea
                className="textarea textarea-bordered w-full"
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your feedback..."
              ></textarea>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button onClick={handleSubmitReview} className="btn btn-primary">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPolicy;
