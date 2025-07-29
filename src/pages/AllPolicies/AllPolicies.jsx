import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";

const fetchPolicies = async ({ queryKey }) => {
  const [_key, page, categoryFilter, searchTerm] = queryKey;

  let query = `https://life-insurance-server-three.vercel.app/policies?page=${page}&limit=9`;

  if (categoryFilter) {
    query += `&category=${encodeURIComponent(categoryFilter)}`;
  }
  if (searchTerm) {
    query += `&search=${encodeURIComponent(searchTerm)}`;
  }

  const { data } = await axios.get(query);
  return data;
};

const AllPolicies = () => {
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["policies", page, categoryFilter, searchTerm],
    queryFn: fetchPolicies,
    keepPreviousData: true,
  });

  const totalPages = data ? Math.ceil(data.total / 9) : 0;

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setPage(1);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    setSearchTerm(inputValue);
    setPage(1);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <Helmet>
        <title>All policies | My Insurance Platform</title>
      </Helmet>
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        All Insurance Policies
      </h2>

      {/* Search input */}
      <div className="mb-4 flex justify-center gap-2">
        <input
          type="text"
          placeholder="Search by keyword..."
          value={inputValue}
          onChange={handleInputChange}
          className="input input-bordered w-full max-w-md"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex justify-center">
        <select
          value={categoryFilter}
          onChange={handleCategoryChange}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="">All Categories</option>
          <option value="Term Life">Term Life</option>
          <option value="Health">Health</option>
          <option value="Whole Life">Whole Life</option>
          <option value="Endowment">Endowment</option>
          <option value="Senior Plan">Senior Plan</option>
          <option value="Accident Insurance">Accident Insurance</option>
          <option value="Disability">Disability</option>
        </select>
      </div>

      {/* Policies grid */}
      {isLoading ? (
        <p className="text-center">Loading policies...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Failed to load policies.</p>
      ) : !data?.data?.length ? (
        <p className="text-center text-gray-500">No policies found.</p>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {data.data.map((policy) => (
              <div
                key={policy._id}
                className="rounded-xl shadow-md p-5 transition-transform duration-300 bg-blue-100 hover:shadow-xl"
              >
                <div
                  className="rounded-md overflow-hidden mb-4 cursor-pointer"
                  onClick={() => navigate(`/policies/${policy._id}`)}
                >
                  <img
                    src={
                      policy.image ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={policy.title}
                    className="w-full h-[200px] object-contain bg-white"
                  />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {policy.title}
                </h3>
                <p className="text-base text-gray-700 mb-1">
                  <strong>Category:</strong> {policy.category || "N/A"}
                </p>
                <p className="text-base text-gray-700 truncate">
                  {policy.description || "No description available."}
                </p>

                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => navigate(`/policies/${policy._id}`)}
                    className="btn btn-sm btn-primary"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10 gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`btn btn-sm ${
                  page === num ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AllPolicies;
