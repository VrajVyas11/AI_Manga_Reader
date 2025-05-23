import React, { useState, useEffect } from "react";
import filterOptions from "../../constants/filterOptions";
import FilterCustomDropDown from "./SearchTotalAndFilterOptionsModules/FilterCustomDropDown";
import ThemeGenreTags from "./SearchTotalAndFilterOptionsModules/ThemeGenreTags";
import { Search, Sliders, X, Grid, List, Filter, Trash2 } from "lucide-react";

function SearchTotalAndFilterOptions({
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
  const [searchText, setSearchText] = useState(searchQuery);

  useEffect(() => {
    setSearchText(searchQuery);
  }, [searchQuery]);

  const hasActiveFilters = Object.values(activeFilters).some(
    (value) =>
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === "string" && value !== "")
  );

  const toggleFilter = (filterType, value) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };

      if (
        [
          "tags",
          "genres",
          "rating",
          "status",
          "publicationType",
          "demographic",
          "year",
          "language",
        ].includes(filterType)
      ) {
        if (newFilters[filterType]?.includes(value)) {
          newFilters[filterType] = newFilters[filterType].filter(
            (item) => item !== value
          );
        } else {
          newFilters[filterType] = [...newFilters[filterType], value];
        }
      } else {
        newFilters[filterType] = value === newFilters[filterType] ? "" : value;
      }

      return newFilters;
    });
  };

  const toggleFilterPanel = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const activeFilterCount = Object.entries(activeFilters).reduce(
    (count, [, value]) => {
      if (Array.isArray(value)) {
        return count + value.length;
      }
      return count + (value ? 1 : 0);
    },
    0
  );

  const yearOptions = Array.from(
    { length: 2025 - 1910 + 1 },
    (_, index) => ({
      id: String(1910 + index),
      label: String(1910 + index),
    })
  );

  return (
    <div className="w-full bg-black/10 relative z-50 bg-opacity-90 backdrop-blur-md rounded-2xl p-2 justify-center flex flex-col items-center md:block md:p-8 shadow-2xl border border-purple-900/30">
      {/* Search Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 w-full">
        <div className="flex-1 w-full">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Search manga..."
              className="w-full pr-4 py-3 sm:pr-5 sm:py-4 bg-black/60 backdrop-blur-sm border border-purple-800/50 rounded-xl text-purple-50 placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-600/70 focus:border-purple-600 transition-all duration-300 shadow-inner pl-12 "
            />
            <div
              className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-purple-400"
              aria-label="Search"
            >
              <Search className="h-5 w-5 sm:h-6 sm:w-6 saturate-0 brightness-150" />
            </div>
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-br from-purple-700 to-indigo-900 hover:from-purple-600 hover:to-indigo-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition duration-300 shadow-lg hover:shadow-purple-500/30 text-sm sm:text-base"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex items-center gap-3 self-end lg:self-auto flex-wrap">
          {/* Results count */}
          {searchQuery && (
            <div className="hidden  lg:flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-purple-900/50">
              <span className="text-purple-400 font-bold">
                {filteredResults.length}
              </span>
              <span className="text-purple-200/70">
                {filteredResults.length === 1 ? "result" : "results"}
              </span>
            </div>
          )}

          {/* Filter button */}
          <button
            onClick={toggleFilterPanel}
            className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium transition-all duration-300 ${
              isFilterOpen
                ? "bg-gradient-to-r from-purple-700 to-indigo-900 text-white shadow-xl shadow-purple-700/30"
                : "bg-black/60 hover:bg-black/80 text-purple-200 border border-purple-900/50 hover:border-purple-700/70"
            }`}
            aria-expanded={isFilterOpen}
            aria-controls="filter-panel"
          >
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center min-w-5 h-5 px-1.5 bg-purple-300 text-purple-900 text-xs font-bold rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* View toggle */}
          <div className="flex bg-black/60 border border-purple-900/50 rounded-lg overflow-hidden shadow-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-purple-700 to-indigo-900 text-white"
                  : "text-purple-300 hover:text-white hover:bg-purple-900/30"
              }`}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-all duration-300 ${
                viewMode === "list"
                  ? "bg-gradient-to-r from-purple-700 to-indigo-900 text-white"
                  : "text-purple-300 hover:text-white hover:bg-purple-900/30"
              }`}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <List className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search query display and results count (mobile) */}
      {searchQuery && (
        <div className={`flex -mt-16 relative -z-10 md:-mt-0 flex-col ${isFilterOpen ? "mb-4" : "mb-0"} md:flex-row justify-between items-start md:items-center gap-2 w-full`}>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
            <span className="text-purple-500">Results for </span>
            <span className="text-white">"</span>
            <span className="text-purple-300 font-semibold">{searchQuery}</span>
            <span className="text-white">"</span>
          </h1>
          <p className="text-purple-300/70 lg:hidden text-sm sm:text-base">
            {filteredResults.length > 0 &&
              `${filteredResults.length} ${filteredResults.length === 1 ? "result" : "results"
              } found`}
          </p>
        </div>
      )}

      {/* Filters panel */}
      {isFilterOpen && (
        <div
          id="filter-panel"
          className="bg-black/80 backdrop-blur-md border border-purple-900/50 rounded-xl p-6 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-800 p-2 rounded-lg shadow-lg shadow-purple-700/20">
                <Sliders className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-purple-200">
                Advanced Search
              </h2>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors duration-300 group"
              >
                <Trash2 className="h-4 w-4 group-hover:text-purple-300" />
                Clear All Filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
            {/* Content Rating */}
            <FilterCustomDropDown
              title="Content Rating"
              multiple={true}
              options={filterOptions.ratings}
              selectedValues={activeFilters.rating}
              onSelectionChange={(value) => toggleFilter("rating", value)}
              countLabel={"Any Rating"}
            />

            {/* Publication Status */}
            <FilterCustomDropDown
              multiple={true}
              title="Publication Status"
              options={filterOptions.statuses}
              selectedValues={activeFilters.status}
              onSelectionChange={(value) => toggleFilter("status", value)}
              countLabel={"Any Status"}
            />

            {/* Original Language */}
            <FilterCustomDropDown
              title="Original/Translated Language"
              multiple={true}
              options={filterOptions.languages}
              selectedValues={activeFilters.language}
              onSelectionChange={(value) => toggleFilter("language", value)}
              countLabel={"Any Language"}
            />

            {/* Publication Year */}
            <FilterCustomDropDown
              title="Original Publication Year"
              options={yearOptions}
              selectedValues={activeFilters.year}
              onSelectionChange={(value) => toggleFilter("year", value)}
              countLabel={"Any year"}
            />


            {/* Publication Demographic */}
            <FilterCustomDropDown
              title="Demographic"
              options={filterOptions.demographics}
              selectedValues={activeFilters.demographic}
              onSelectionChange={(value) => toggleFilter("demographic", value)}
              countLabel={"Any Demographic"}
            />

            {/* Publication Type */}
            <FilterCustomDropDown
              title="Publication Type"
              options={filterOptions.publicationTypes}
              selectedValues={activeFilters.publicationType}
              onSelectionChange={(value) => toggleFilter("publicationType", value)}
              countLabel={"Any Publication Type"}
            />

            {/* Tags - Spans 2 columns on larger screens */}
            <ThemeGenreTags
              activeFilters={activeFilters}
              filterOptions={filterOptions}
              toggleFilter={toggleFilter}
              key={"ThemeGenreTags"}
            />

            {/* Sort By */}
            <FilterCustomDropDown
              title="Sort By"
              multiple={false}
              options={filterOptions.sortOptions}
              selectedValues={activeFilters.sortBy}
              onSelectionChange={(value) => toggleFilter("sortBy", value)}
              countLabel={"Any"}
            />
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && !isFilterOpen && (
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 w-full">
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1.5 bg-black/60 border border-purple-800/50 rounded-full px-3 py-1.5 text-xs sm:text-sm text-purple-400 hover:text-white transition-colors"
          >
            Clear All
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchTotalAndFilterOptions;