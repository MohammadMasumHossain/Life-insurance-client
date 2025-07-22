import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchPolicyById = async (id) => {
  const { data } = await axios.get(`http://localhost:3000/policies/${id}`);
  return data;
};

const PolicyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: policy, isLoading, isError } = useQuery({
    queryKey: ['policy', id],
    queryFn: () => fetchPolicyById(id),
  });

  if (isLoading) return <p className="text-center mt-10">Loading policy details...</p>;
  if (isError || !policy) return <p className="text-center text-red-500 mt-10">Failed to load policy details.</p>;

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
          {/* Policy image */}
          <img
            src={policy.image || 'https://via.placeholder.com/600x400?text=No+Image'}
            alt={policy.title}
            className="w-full h-[650px] object-cover object-top"
          />

          {/* Content */}
          <div className="p-6 space-y-6">
            <h2 className="text-3xl font-bold text-blue-700">{policy.title}</h2>
            <p className="text-gray-700 text-lg">{policy.description}</p>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p><strong>Category:</strong> {policy.category}</p>
              <p><strong>Policy Type:</strong> {policy.policyType}</p>
              <p><strong>Coverage Amount:</strong> ${policy.coverageAmount.toLocaleString()}</p>
              <p><strong>Term Duration:</strong> {policy.termDuration}</p>
              <p><strong>Popularity:</strong> {policy.popularity} purchases</p>
              <p><strong>Renewable:</strong> {policy.renewable ? 'Yes' : 'No'}</p>
              <p><strong>Convertible:</strong> {policy.convertible ? 'Yes' : 'No'}</p>
            </div>

            {/* Eligibility */}
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Eligibility</h3>
              <ul className="list-disc pl-6 text-sm text-gray-800">
                <li><strong>Age:</strong> {policy.eligibility?.minAge} - {policy.eligibility?.maxAge}</li>
                <li><strong>Residency:</strong> {policy.eligibility?.residency}</li>
                <li><strong>Medical Exam Required:</strong> {policy.eligibility?.medicalExamRequired ? 'Yes' : 'No'}</li>
              </ul>
            </div>

            {/* Excluded Conditions */}
            {policy.healthConditionsExcluded?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">Excluded Health Conditions</h3>
                <ul className="list-disc pl-6 text-sm text-gray-800">
                  {policy.healthConditionsExcluded.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Benefits</h3>
              <ul className="list-disc pl-6 text-sm text-gray-800">
                <li><strong>Death Benefit:</strong> {policy.benefits?.deathBenefit}</li>
                <li><strong>Tax Benefits:</strong> {policy.benefits?.taxBenefits}</li>
                <li><strong>Accidental Death Rider:</strong> {policy.benefits?.accidentalDeathRider ? 'Yes' : 'No'}</li>
                <li><strong>Critical Illness Rider:</strong> {policy.benefits?.criticalIllnessRider ? 'Yes' : 'No'}</li>
                <li><strong>Waiver of Premium:</strong> {policy.benefits?.waiverOfPremium}</li>
              </ul>
            </div>

            {/* Premium Calculation */}
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Premium Calculation</h3>
              <p className="text-sm text-gray-800"><strong>Base Rate per $1,000:</strong> ${policy.premiumCalculation?.baseRatePerThousand}</p>
              <p className="text-sm text-gray-800"><strong>Smoker Surcharge:</strong> {policy.premiumCalculation?.ageFactor?.smokerSurchargePercent}%</p>
              <p className="text-sm text-gray-800 mt-2 italic">{policy.premiumCalculation?.ageFactor?.formula}</p>
            </div>

            {/* Payment Options */}
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Payment Options</h3>
              <div className="flex gap-3 flex-wrap text-sm text-gray-700">
                {policy.paymentOptions?.map((opt, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    {opt}
                  </span>
                ))}
              </div>
            </div>

            {/* Term Length Options */}
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Term Length Options</h3>
              <div className="flex gap-3 flex-wrap text-sm text-gray-700">
                {policy.termLengthOptions?.map((opt, index) => (
                  <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    {opt}
                  </span>
                ))}
              </div>
            </div>

            {/* Get Quote Button */}
            <div className="text-center pt-8">
              <button
                onClick={() => navigate(`/quote`)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300 shadow-md"
              >
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetails;
