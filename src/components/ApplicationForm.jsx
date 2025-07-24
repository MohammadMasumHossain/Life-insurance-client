import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';

// Sample policies list - replace with your actual data or fetch it dynamically
const policies = [
  { policyType: "Level Term Insurance", coverageAmount: 1000000, termDuration: "30 years" },
  { policyType: "Critical Illness Rider", coverageAmount: 800000, termDuration: "25 years" },
  { policyType: "Whole Life Insurance", coverageAmount: 1500000, termDuration: "15 years" },
  { policyType: "Comprehensive Life Cover", coverageAmount: 900000, termDuration: "25 years" },
  { policyType: "Child Education Plan", coverageAmount: 1200000, termDuration: "20 years" },
];

const healthOptions = [
  'Heart Disease',
  'Diabetes',
  'High Blood Pressure',
  'Asthma',
  'Cancer',
  'Kidney Problems',
  'Liver Disease',
  'Mental Health Issues',
  'Chronic Pain',
  'Epilepsy',
  'Tuberculosis',
  'None'
];

// Utility to get unique values by key from policies
const uniqueValues = (arr, key) => [...new Set(arr.map(item => item[key]))];

const ApplicationForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const [submitting, setSubmitting] = useState(false);

  // State to hold unique select options
  const [policyTypes, setPolicyTypes] = useState([]);
  const [coverageAmounts, setCoverageAmounts] = useState([]);
  const [termDurations, setTermDurations] = useState([]);

  useEffect(() => {
    setPolicyTypes(uniqueValues(policies, 'policyType'));
    setCoverageAmounts(uniqueValues(policies, 'coverageAmount'));
    setTermDurations(uniqueValues(policies, 'termDuration'));
  }, []);

  const onSubmit = async (data) => {
    setSubmitting(true);

    // Prepare application object similar to your backend
    const application = {
      fullName: data.fullName,
      email: data.email,
      address: data.address,
      phoneNumber: data.phone,
      dateOfBirth: data.dob,
      nid: data.nid,
      nomineeName: data.nomineeName,
      nomineeRelationship: data.nomineeRelation,
      nomineeNID: data.nomineeNID,
      healthConditions: Array.isArray(data.healthConditions)
        ? data.healthConditions
        : data.healthConditions
          ? [data.healthConditions]
          : [],
      policyType: data.policyType,
      coverageAmount: Number(data.coverageAmount),
      termDuration: data.termDuration,
      status: 'Pending',
      submittedAt: new Date()
    };

    try {
      const res = await axios.post('http://localhost:3000/applications', application);
      if (res.data.insertedId) {
        Swal.fire('Success!', 'Application submitted successfully!', 'success');
        reset();
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Insurance Application Form</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* Personal Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input {...register('fullName', { required: true })} className="input input-bordered w-full" placeholder="Full Name" required />
              <input {...register('email', { required: true })} type="email" className="input input-bordered w-full" placeholder="Email Address" required />
              <input {...register('address', { required: true })} className="input input-bordered w-full" placeholder="Address" required />
              <input {...register('phone', { required: true })} className="input input-bordered w-full" placeholder="Phone Number" required />
              <input {...register('dob', { required: true })} type="date" className="input input-bordered w-full" required />
              <input {...register('nid', { required: true })} className="input input-bordered w-full" placeholder="NID Number" required />
            </div>
          </div>

          {/* Nominee Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Nominee Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input {...register('nomineeName', { required: true })} className="input input-bordered w-full" placeholder="Nominee Full Name" required />
              <input {...register('nomineeRelation', { required: true })} className="input input-bordered w-full" placeholder="Relationship" required />
              <input {...register('nomineeNID', { required: true })} className="input input-bordered w-full" placeholder="Nominee NID" required />
            </div>
          </div>

          {/* Policy Details */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Policy Details</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Policy Type */}
              <select {...register('policyType', { required: true })} className="select select-bordered w-full" defaultValue="">
                <option value="" disabled>Select Policy Type</option>
                {policyTypes.map((type, idx) => (
                  <option key={idx} value={type}>{type}</option>
                ))}
              </select>

              {/* Coverage Amount */}
              <select {...register('coverageAmount', { required: true })} className="select select-bordered w-full" defaultValue="">
                <option value="" disabled>Select Coverage Amount</option>
                {coverageAmounts.map((amount, idx) => (
                  <option key={idx} value={amount}>{amount.toLocaleString()}</option>
                ))}
              </select>

              {/* Term Duration */}
              <select {...register('termDuration', { required: true })} className="select select-bordered w-full" defaultValue="">
                <option value="" disabled>Select Term Duration</option>
                {termDurations.map((duration, idx) => (
                  <option key={idx} value={duration}>{duration}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Health Disclosure */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Health Conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {healthOptions.map((condition) => (
                <label key={condition} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={condition}
                    {...register('healthConditions')}
                    className="checkbox checkbox-sm"
                  />
                  <span>{condition}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full mt-4"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
