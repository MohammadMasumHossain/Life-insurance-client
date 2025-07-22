import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';

const ApplicationForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const [submitting, setSubmitting] = useState(false);

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

  const onSubmit = async (data) => {
    setSubmitting(true);

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
        : [data.healthConditions],
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
