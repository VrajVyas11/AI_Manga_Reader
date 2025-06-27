import React, { useState, useEffect, useMemo } from "react";
import { Search, Sliders, X, Grid, List, Filter, Trash2, ChevronDown } from "lucide-react";
import ThemeGenreTags from "./SearchTotalAndFilterOptionsModules/ThemeGenreTags"
import filterOptions from "../../constants/filterOptions";
import FilterCustomDropDown from "./SearchTotalAndFilterOptionsModules/FilterCustomDropDown"


// Main SearchTotalAndFilterOptions Component
export default function SearchTotalAndFilterOptions({
  setActiveFilters,
  activeFilters,
  setViewMode,
  viewMode,
  clearAllFilters,
  searchQuery,
  filteredResults,
  handleSearch,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchText, setSearchText] = useState(searchQuery || '');

  useEffect(() => {
    setSearchText(searchQuery || '');
  }, [searchQuery]);

  const hasActiveFilters = Object.values(activeFilters).some(
    (value) =>
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === "string" && value !== "")
  );

  const toggleFilter = (filterType, value) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };

      if (["tags", "genres", "rating", "status", "publicationType", "demographic", "year", "language"].includes(filterType)) {
        if (newFilters[filterType]?.includes(value)) {
          newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
        } else {
          newFilters[filterType] = [...(newFilters[filterType] || []), value];
        }
      } else {
        newFilters[filterType] = value === newFilters[filterType] ? "" : value;
      }

      return newFilters;
    });
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (handleSearch) {
      handleSearch(e);
    }
  };

  const activeFilterCount = Object.entries(activeFilters).reduce((count, [, value]) => {
    if (Array.isArray(value)) {
      return count + value.length;
    }
    return count + (value ? 1 : 0);
  }, 0);

  const yearOptions = Array.from({ length: 2025 - 1910 + 1 }, (_, index) => ({
    id: String(1910 + index),
    label: String(1910 + index),
  }));

  return (
    <div className="w-full ">
      {/* Glassmorphism Container */}
      <div className="shadow-2xl shadow-black/20">

        {/* Search Header */}
        <div className="space-y-6">
          <div className="flex mb-7 sm:mb-8 justify-between items-center gap-3">

            <div className=" flex flex-row gap-3"><div className="bg-white/10 p-3 rounded-lg">
              <Search className="w-6 h-6  md:w-7 md:h-7 text-yellow-300 drop-shadow-md" />
            </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">
                  Advanced Search
                </h2>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Search Your Next To Read Manga by entering keywords
                </p>
              </div>
            </div>
            <div className="flex  justify-center items-center  rounded-lg shadow-md">
              <button
                onClick={clearAllFilters}
                disabled={!hasActiveFilters}
                className="flex items-center disabled:bg-gray-500/10 backdrop-blur-md disabled:text-gray-400 gap-2 text-sm font-semibold text-red-300 hover:text-red-100 transition-colors bg-red-600/30 hover:bg-red-500/80 px-6 py-4 rounded-md shadow-sm group focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="Clear all active filters"
              >
                <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Reset Filters
              </button>
            </div>
          </div>
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full gap-3 group flex flex-row">
            <div className="relative w-full">
              <input
                type="text"
                value={searchText}
                onChange={handleSearchChange}
                placeholder="Search "
                className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-lg py-2.5 pl-12 pr-24 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 transition-all duration-300 text-lg"
              />
              <Search className="absolute -mt-0.5 left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              {searchText && <button className="absolute  right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={() => setSearchText("")}
              >
                <X className="w-5 h-5" />
              </button>}
            </div>
            <button
              type="submit"
              className="relative flex flex-row gap-3 justify-center items-center bg-gradient-to-r from-purple-700/50 to-indigo-700/50 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:bg-purple-500/40 font-medium"
            >
              <Search className=" w-5 h-5 " />Search
            </button>

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`relative flex whitespace-nowrap backdrop-blur-md flex-row gap-3 justify-center items-center text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium ${isFilterOpen
                ? " text-white shadow-lg bg-gray-400/20 "
                : "bg-gray-800/60"
                }`}
            >
              <ChevronDown className={`w-5 h-5 ${isFilterOpen ? "rotate-180" : ""}`} />
              {isFilterOpen ? "Hide" : "Show"} Filters
              {activeFilterCount > 0 && (
                <span className="bg-gradient-to-r from-purple-700/70 to-indigo-700/70 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* View Toggle */}
            <div className="flex min-w-fit bg-gray-900/80 border border-gray-700 rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => setViewMode && setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
                className={`p-2.5 px-4 transition-colors duration-300 flex items-center justify-center rounded-l-lg ${viewMode === "grid"
                  ? "bg-gradient-to-r from-purple-700/70 to-indigo-700/70 text-white shadow-lg"
                  : "text-gray-500 hover:text-purple-400 hover:bg-gray-800"
                  }`}
                title="Grid View"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode && setViewMode("list")}
                aria-pressed={viewMode === "list"}
                className={`p-2.5 px-4 transition-colors duration-300 flex items-center justify-center rounded-r-lg ${viewMode === "list"
                  ? "bg-gradient-to-r from-purple-700/70 to-indigo-700/70 text-white shadow-lg"
                  : "text-gray-500 hover:text-purple-400 hover:bg-gray-800"
                  }`}
                title="List View"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
        {/* Filters Panel */}
        {isFilterOpen && (
          <div className="mt-9 ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <FilterCustomDropDown
                title="Content Rating"
                multiple={true}
                options={filterOptions.ratings}
                selectedValues={activeFilters.rating || []}
                onSelectionChange={(value) => toggleFilter("rating", value)}
                countLabel="Any Rating"
              />

              <FilterCustomDropDown
                title="Publication Status"
                multiple={true}
                options={filterOptions.statuses}
                selectedValues={activeFilters.status || []}
                onSelectionChange={(value) => toggleFilter("status", value)}
                countLabel="Any Status"
              />

              <FilterCustomDropDown
                title="Language"
                multiple={true}
                options={filterOptions.languages}
                selectedValues={activeFilters.language || []}
                onSelectionChange={(value) => toggleFilter("language", value)}
                countLabel="Any Language"
              />

              <FilterCustomDropDown
                title="Publication Year"
                multiple={true}
                options={yearOptions}
                selectedValues={activeFilters.year || []}
                onSelectionChange={(value) => toggleFilter("year", value)}
                countLabel="Any Year"
              />

              <FilterCustomDropDown
                title="Demographic"
                multiple={true}
                options={filterOptions.demographics}
                selectedValues={activeFilters.demographic || []}
                onSelectionChange={(value) => toggleFilter("demographic", value)}
                countLabel="Any Demographic"
              />

              <FilterCustomDropDown
                title="Publication Type"
                multiple={true}
                options={filterOptions.publicationTypes}
                selectedValues={activeFilters.publicationType || []}
                onSelectionChange={(value) => toggleFilter("publicationType", value)}
                countLabel="Any Type"
              />

              <ThemeGenreTags
                activeFilters={activeFilters}
                filterOptions={filterOptions}
                toggleFilter={toggleFilter}
              />

              <FilterCustomDropDown
                title="Sort By"
                multiple={false}
                options={filterOptions.sortOptions}
                selectedValues={activeFilters.sortBy || ""}
                onSelectionChange={(value) => toggleFilter("sortBy", value)}
                countLabel="Default"
              />
            </div>
          </div>
        )}
        {/* Controls Bar */}
        <div className="flex mt-4 flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Results Info */}
          {searchQuery && (
            <div className="space-y-1">
              <h1 className="text-xl lg:text-2xl font-bold">
                <span className="text-purple-400">Results for </span>
                <span className="text-white">"</span>
                <span className="text-gray-200">{searchQuery}</span>
                <span className="text-white">"</span>
              </h1>
              <p className="text-gray-400 text-sm">
                {filteredResults?.length || 0} {(filteredResults?.length || 0) === 1 ? "result" : "results"} found
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}