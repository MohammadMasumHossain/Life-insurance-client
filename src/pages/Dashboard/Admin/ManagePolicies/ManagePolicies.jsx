import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaEdit, FaTrash } from "react-icons/fa";
import axiosSecure from "../../../../hooks/axiosSecure";

// Optional: change to your own small icon
const HEADER_ICON =
  "https://cdn-icons-png.flaticon.com/512/684/684831.png";

const initialFormState = {
  title: "",
  category: "",
  policyType: "",
  description: "",
  image: "",
  coverageAmount: "",
  termDuration: "",
  popularity: "",
  eligibility: {
    minAge: "",
    maxAge: "",
    residency: "",
    medicalExamRequired: false,
  },
  healthConditionsExcluded: "",
  benefits: {
    deathBenefit: "",
    taxBenefits: "",
    accidentalDeathRider: false,
    criticalIllnessRider: false,
    waiverOfPremium: "",
  },
  premiumCalculation: {
    baseRatePerThousand: "",
    smokerSurchargePercent: "",
    formula: "",
    ageFactor: "{}", // JSON string user can edit
  },
  paymentOptions: "",
  termLengthOptions: "",
  renewable: false,
  convertible: false,
};

function serializeToPayload(state) {
  const s = state;
  const toArray = (v) =>
    typeof v === "string"
      ? v
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
      : [];

  let ageFactorObj = {};
  try {
    ageFactorObj =
      typeof s.premiumCalculation.ageFactor === "string"
        ? JSON.parse(s.premiumCalculation.ageFactor || "{}")
        : s.premiumCalculation.ageFactor || {};
  } catch {
    ageFactorObj = {};
  }

  return {
    title: s.title,
    category: s.category,
    policyType: s.policyType,
    description: s.description,
    image: s.image,
    coverageAmount: Number(s.coverageAmount),
    termDuration: s.termDuration,
    popularity: Number(s.popularity) || 0,
    eligibility: {
      minAge: Number(s.eligibility.minAge),
      maxAge: Number(s.eligibility.maxAge),
      residency: s.eligibility.residency,
      medicalExamRequired: !!s.eligibility.medicalExamRequired,
    },
    healthConditionsExcluded: toArray(s.healthConditionsExcluded),
    benefits: {
      deathBenefit: s.benefits.deathBenefit,
      taxBenefits: s.benefits.taxBenefits,
      accidentalDeathRider: !!s.benefits.accidentalDeathRider,
      criticalIllnessRider: !!s.benefits.criticalIllnessRider,
      waiverOfPremium: s.benefits.waiverOfPremium,
    },
    premiumCalculation: {
      baseRatePerThousand: Number(s.premiumCalculation.baseRatePerThousand),
      smokerSurchargePercent: Number(s.premiumCalculation.smokerSurchargePercent),
      formula: s.premiumCalculation.formula,
      ageFactor: ageFactorObj,
    },
    paymentOptions: toArray(s.paymentOptions),
    termLengthOptions: toArray(s.termLengthOptions),
    renewable: !!s.renewable,
    convertible: !!s.convertible,
  };
}

const ManagePolicies = () => {
  const queryClient = useQueryClient();

  // UI state
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [category, setCategory] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState(initialFormState);

  // ----------- Queries -----------
  const { data, isLoading, isError } = useQuery({
    queryKey: ["policies", { page, limit, category }],
    queryFn: async () => {
      const res = await axiosSecure.get("/policies", {
        params: { page, limit, category },
      });
      return res.data; // { total, page, limit, data }
    },
    keepPreviousData: true,
  });

  const policies = useMemo(() => data?.data ?? [], [data]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // ----------- Mutations -----------
  const createMutation = useMutation({
    mutationFn: async (payload) => axiosSecure.post("/policies", payload),
    onSuccess: () => {
      Swal.fire("Success", "Policy created successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      closeModal();
    },
    onError: () => Swal.fire("Error", "Failed to create policy", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => axiosSecure.put(`/policies/${id}`, payload),
    onSuccess: () => {
      Swal.fire("Success", "Policy updated successfully", "success");
      queryClient.invalidateQueries({ queryKey: ["policies"] });
      closeModal();
    },
    onError: () => Swal.fire("Error", "Failed to update policy", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/policies/${id}`),
    onSuccess: () => {
      Swal.fire("Deleted", "Policy deleted", "success");
      queryClient.invalidateQueries({ queryKey: ["policies"] });
    },
    onError: () => Swal.fire("Error", "Failed to delete policy", "error"),
  });

  // ----------- Handlers -----------
  const openAddModal = () => {
    setIsEdit(false);
    setEditingId(null);
    setFormState(initialFormState);
    setShowModal(true);
  };

  const openEditModal = (policy) => {
    setIsEdit(true);
    setEditingId(policy._id);

    setFormState({
      ...initialFormState,
      ...policy,
      eligibility: {
        minAge: policy.eligibility?.minAge ?? "",
        maxAge: policy.eligibility?.maxAge ?? "",
        residency: policy.eligibility?.residency ?? "",
        medicalExamRequired: !!policy.eligibility?.medicalExamRequired,
      },
      healthConditionsExcluded: (policy.healthConditionsExcluded || []).join(", "),
      benefits: {
        deathBenefit: policy.benefits?.deathBenefit ?? "",
        taxBenefits: policy.benefits?.taxBenefits ?? "",
        accidentalDeathRider: !!policy.benefits?.accidentalDeathRider,
        criticalIllnessRider: !!policy.benefits?.criticalIllnessRider,
        waiverOfPremium: policy.benefits?.waiverOfPremium ?? "",
      },
      premiumCalculation: {
        baseRatePerThousand: policy.premiumCalculation?.baseRatePerThousand ?? "",
        smokerSurchargePercent: policy.premiumCalculation?.smokerSurchargePercent ?? "",
        formula: policy.premiumCalculation?.formula ?? "",
        ageFactor: JSON.stringify(policy.premiumCalculation?.ageFactor ?? {}, null, 2),
      },
      paymentOptions: (policy.paymentOptions || []).join(", "),
      termLengthOptions: (policy.termLengthOptions || []).join(", "),
      renewable: !!policy.renewable,
      convertible: !!policy.convertible,
      popularity: policy.popularity ?? "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setEditingId(null);
    setFormState(initialFormState);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This policy will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((res) => {
      if (res.isConfirmed) deleteMutation.mutate(id);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = serializeToPayload(formState);

    if (isEdit && editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  // ----------- Render -----------
  if (isLoading) return <p className="p-6">Loading policies...</p>;
  if (isError) return <p className="p-6 text-red-500">Failed to load policies.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-white py-8 px-4 md:px-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <img src={HEADER_ICON} alt="icon" className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Manage Policies</h1>
        </div>

        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="select select-bordered"
          >
            <option>All</option>
            <option>Term Life</option>
            <option>Senior</option>
            <option>Health</option>
            {/* add more if you use more categories */}
          </select>

          <button
            onClick={openAddModal}
            className="btn bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add New Policy
          </button>
        </div>
      </header>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg bg-white">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Policy Type</th>
              <th>Coverage (Taka) </th>
              <th>Term</th>
              <th>Popularity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {policies.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6">
                  No policies found
                </td>
              </tr>
            )}
            {policies.map((p) => (
              <tr key={p._id} className="hover">
                <td className="whitespace-pre-wrap">{p.title}</td>
                <td>{p.category}</td>
                <td>{p.policyType}</td>
                <td>{p.coverageAmount}</td>
                <td>{p.termDuration}</td>
                <td>{p.popularity ?? 0}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="btn btn-sm bg-yellow-400 hover:bg-yellow-500 text-white"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="btn btn-sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            className="btn btn-sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              {isEdit ? "Edit Policy" : "Add Policy"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic */}
              <input
                className="input input-bordered"
                placeholder="Title"
                value={formState.title}
                onChange={(e) => setFormState((s) => ({ ...s, title: e.target.value }))}
                required
              />
              <input
                className="input input-bordered"
                placeholder="Category (e.g. Term Life)"
                value={formState.category}
                onChange={(e) => setFormState((s) => ({ ...s, category: e.target.value }))}
                required
              />
              <input
                className="input input-bordered"
                placeholder="Policy Type (e.g. Level Term Insurance)"
                value={formState.policyType}
                onChange={(e) => setFormState((s) => ({ ...s, policyType: e.target.value }))}
                required
              />
              <input
                className="input input-bordered"
                placeholder="Image URL"
                value={formState.image}
                onChange={(e) => setFormState((s) => ({ ...s, image: e.target.value }))}
              />
              <textarea
                className="textarea textarea-bordered md:col-span-2"
                placeholder="Description"
                value={formState.description}
                onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))}
                required
              />

              {/* Numbers */}
              <input
                type="number"
                className="input input-bordered"
                placeholder="Coverage Amount"
                value={formState.coverageAmount}
                onChange={(e) => setFormState((s) => ({ ...s, coverageAmount: e.target.value }))}
              />
              <input
                className="input input-bordered"
                placeholder="Term Duration (e.g. 30 years)"
                value={formState.termDuration}
                onChange={(e) => setFormState((s) => ({ ...s, termDuration: e.target.value }))}
              />
              <input
                type="number"
                className="input input-bordered"
                placeholder="Popularity"
                value={formState.popularity}
                onChange={(e) => setFormState((s) => ({ ...s, popularity: e.target.value }))}
              />

              {/* Eligibility */}
              <h3 className="text-lg font-semibold md:col-span-2 mt-4">Eligibility</h3>
              <input
                type="number"
                className="input input-bordered"
                placeholder="Min Age"
                value={formState.eligibility.minAge}
                onChange={(e) =>
                  setFormState((s) => ({
                    ...s,
                    eligibility: { ...s.eligibility, minAge: e.target.value },
                  }))
                }
              />
              <input
                type="number"
                className="input input-bordered"
                placeholder="Max Age"
                value={formState.eligibility.maxAge}
                onChange={(e) =>
                  setFormState((s) => ({
                    ...s,
                    eligibility: { ...s.eligibility, maxAge: e.target.value },
                  }))
                }
              />
              <input
                className="input input-bordered md:col-span-2"
                placeholder="Residency"
                value={formState.eligibility.residency}
                onChange={(e) =>
                  setFormState((s) => ({
                    ...s,
                    eligibility: { ...s.eligibility, residency: e.target.value },
                  }))
                }
              />
              <label className="label cursor-pointer md:col-span-2">
                <span className="label-text">Medical Exam Required?</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={formState.eligibility.medicalExamRequired}
                  onChange={(e) =>
                    setFormState((s) => ({
                      ...s,
                      eligibility: { ...s.eligibility, medicalExamRequired: e.target.checked },
                    }))
                  }
                />
              </label>

              {/* Health conditions excluded */}
              <textarea
                className="textarea textarea-bordered md:col-span-2"
                placeholder="Health Conditions Excluded (comma separated)"
                value={formState.healthConditionsExcluded}
                onChange={(e) => setFormState((s) => ({ ...s, healthConditionsExcluded: e.target.value }))}
              />

              {/* Benefits */}
              <h3 className="text-lg font-semibold md:col-span-2 mt-4">Benefits</h3>
              <input
                className="input input-bordered md:col-span-2"
                placeholder="Death Benefit"
                value={formState.benefits.deathBenefit}
                onChange={(e) =>
                  setFormState((s) => ({
                    ...s,
                    benefits: { ...s.benefits, deathBenefit: e.target.value },
                  }))
                }
              />
              <input
                className="input input-bordered md:col-span-2"
                placeholder="Tax Benefits"
                value={formState.benefits.taxBenefits}
                onChange={(e) =>
                  setFormState((s) => ({
                    ...s,
                    benefits: { ...s.benefits, taxBenefits: e.target.value },
                  }))
                }
              />
              <label className="label cursor-pointer">
                <span className="label-text">Accidental Death Rider</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={formState.benefits.accidentalDeathRider}
                  onChange={(e) =>
                    setFormState((s) => ({
                      ...s,
                      benefits: { ...s.benefits, accidentalDeathRider: e.target.checked },
                    }))
                  }
                />
              </label>
              <label className="label cursor-pointer">
                <span className="label-text">Critical Illness Rider</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={formState.benefits.criticalIllnessRider}
                  onChange={(e) =>
                    setFormState((s) => ({
                      ...s,
                      benefits: { ...s.benefits, criticalIllnessRider: e.target.checked },
                    }))
                  }
                />
              </label>
              <input
                className="input input-bordered md:col-span-2"
                placeholder="Waiver Of Premium"
                value={formState.benefits.waiverOfPremium}
                onChange={(e) =>
                  setFormState((s) => ({
                    ...s,
                    benefits: { ...s.benefits, waiverOfPremium: e.target.value },
                  }))
                }
              />

              {/* Premium Calculation */}
              <h3 className="text-lg font-semibold md:col-span-2 mt-4">Premium Calculation</h3>
              <input
                type="number"
                className="input input-bordered"
                placeholder="Base Rate Per Thousand"
                value={formState.premiumCalculation.baseRatePerThousand}
                onChange={(e) =>
                  setFormState((s) => ({
                    ...s,
                    premiumCalculation: {
                      ...s.premiumCalculation,
                      baseRatePerThousand: e.target.value,
                    },
                  }))
                }
              />
              <input
                type="number"
                className="input input-bordered"
                placeholder="Smoker Surcharge %"
                value={formState.premiumCalculation.smokerSurchargePercent}
                onChange={(e) =>
                  setFormState((s) => ({
                    ...s,
                    premiumCalculation: {
                      ...s.premiumCalculation,
                      smokerSurchargePercent: e.target.value,
                    },
                  }))
                }
              />
              <textarea
                className="textarea textarea-bordered md:col-span-2"
                placeholder="Formula"
                value={formState.premiumCalculation.formula}
                onChange={(e) =>
                  setFormState((s) => ({
                    ...s,
                    premiumCalculation: {
                      ...s.premiumCalculation,
                      formula: e.target.value,
                    },
                  }))
                }
              />
              <textarea
                className="textarea textarea-bordered md:col-span-2"
                placeholder='Age Factor (JSON) e.g. {"18-30":1,"31-40":1.2}'
                value={formState.premiumCalculation.ageFactor}
                onChange={(e) =>
                  setFormState((s) => ({
                    ...s,
                    premiumCalculation: {
                      ...s.premiumCalculation,
                      ageFactor: e.target.value,
                    },
                  }))
                }
              />

              {/* Arrays */}
              <textarea
                className="textarea textarea-bordered md:col-span-2"
                placeholder="Payment Options (comma separated)"
                value={formState.paymentOptions}
                onChange={(e) => setFormState((s) => ({ ...s, paymentOptions: e.target.value }))}
              />
              <textarea
                className="textarea textarea-bordered md:col-span-2"
                placeholder="Term Length Options (comma separated)"
                value={formState.termLengthOptions}
                onChange={(e) => setFormState((s) => ({ ...s, termLengthOptions: e.target.value }))}
              />

              {/* Flags */}
              <label className="label cursor-pointer">
                <span className="label-text">Renewable</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={formState.renewable}
                  onChange={(e) => setFormState((s) => ({ ...s, renewable: e.target.checked }))}
                />
              </label>
              <label className="label cursor-pointer">
                <span className="label-text">Convertible</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={formState.convertible}
                  onChange={(e) => setFormState((s) => ({ ...s, convertible: e.target.checked }))}
                />
              </label>

              <div className="md:col-span-2 flex justify-end gap-2 mt-6">
                <button type="button" className="btn" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                >
                  {isEdit
                    ? updateMutation.isLoading
                      ? "Updating..."
                      : "Update"
                    : createMutation.isLoading
                    ? "Creating..."
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePolicies;
