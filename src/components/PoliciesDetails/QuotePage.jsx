import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const QuotePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    level: 'basic',
    coverageAmount: '',
    duration: '',
    smoker: 'no',
  });

  const [estimate, setEstimate] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculatePremium = () => {
    const { coverageAmount, duration, smoker } = formData;

    const baseRate = 0.04; // 4%
    const amount = parseFloat(coverageAmount) || 0;
    const years = parseInt(duration) || 1;
    const smokerFactor = smoker === 'yes' ? 1.5 : 1.0;

    const totalPayable = amount * baseRate * smokerFactor;
    const annual = (totalPayable / years).toFixed(2);
    const monthly = (annual / 12).toFixed(2);

    setEstimate({ annual, monthly });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculatePremium();
  };

  const handleApply = () => {
    navigate('/application');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-blue-800 text-center mb-6">Insurance Quote Estimator</h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              name="age"
              placeholder="Enter your age"
              className="input input-bordered w-full"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              className="input input-bordered w-full"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Amount (BDT ৳)</label>
            <input
              type="number"
              name="coverageAmount"
              placeholder="e.g. 2000000"
              className="input input-bordered w-full"
              value={formData.coverageAmount}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Policy Duration (Years)</label>
            <input
              type="number"
              name="duration"
              placeholder="e.g. 20"
              className="input input-bordered w-full"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Are you a smoker?</label>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="smoker"
                  value="no"
                  checked={formData.smoker === 'no'}
                  onChange={handleChange}
                />
                Non-Smoker
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="smoker"
                  value="yes"
                  checked={formData.smoker === 'yes'}
                  onChange={handleChange}
                />
                Smoker
              </label>
            </div>
          </div>

          <div className="pt-6 space-y-4">
            <button
              type="submit"
              className="btn bg-blue-600 hover:bg-blue-700 text-white w-full"
            >
              Get Estimated Premium
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="btn bg-green-600 hover:bg-green-700 text-white w-full"
            >
              Apply for Policy
            </button>
          </div>
        </form>

        {estimate && (
          <div className="mt-8 bg-blue-50 p-6 rounded-lg shadow-inner text-center">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Estimated Premium</h3>
            <p className="text-gray-700 text-lg">Monthly: <strong>৳{estimate.monthly}</strong></p>
            <p className="text-gray-700 text-lg">Annual: <strong>৳{estimate.annual}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotePage;

