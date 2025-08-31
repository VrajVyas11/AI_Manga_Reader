import { useState, useEffect } from "react";
import { Search, X, Grid, List, Trash2, ChevronDown } from "lucide-react";
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
  isDark=true,
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchText, setSearchText] = useState(searchQuery ?? '');

  useEffect(() => {
    setSearchText(searchQuery ?? '');
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
          newFilters[filterType] = [...(newFilters[filterType] ?? []), value];
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
  <div className="w-full">
    {/* Glassmorphism Container */}
    <div className={` ${isDark?"shadow-black/20 shadow-2xl":""} `}>

      {/* Search Header */}
      <div className="space-y-4 md:space-y-6">
        <div className="flex mb-7 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${isDark ? 'bg-white/10' : 'bg-gray-100'} p-3 rounded-lg`}> 
              <Search className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 ${isDark ? 'text-yellow-300' : 'text-purple-600'} drop-shadow-md`} />
            </div>
            <div className='leading-5 sm:leading-normal mt-1 sm:mt-0'>
              <h2 className={`text-[18px] md:text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Advanced Search</h2>
              <p className={`text-[11px] hidden md:block md:text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wide`}>Search Your Next To Read Manga by entering keywords</p>
              <p className={`text-[10px] md:hidden md:text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-wide`}>Search Your Next To Read Manga</p>
            </div>
          </div>
          <button
            onClick={clearAllFilters}
            disabled={!hasActiveFilters}
            className={`flex items-center whitespace-nowrap disabled:bg-gray-500/10 backdrop-blur-md disabled:text-gray-400 gap-2 text-sm font-semibold transition-colors px-4 sm:px-6 py-3 sm:py-4 rounded-md shadow-sm group focus:outline-none min-w-fit w-fit justify-center ${isDark 
              ? 'text-red-300 hover:text-red-100 bg-red-600/30 hover:bg-red-500/80 focus:ring-red-400' 
              : 'text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500'}`}
          >
            <Trash2 className="w-4 h-4 min-w-fit sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            <span className="">Reset </span><span className="md:block -ml-1 hidden">Filters</span>
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="space-y-3 md:space-y-0 md:flex md:flex-row md:gap-3 group">
          <div className="relative w-full">
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Search "
              className={`w-full backdrop-blur-sm border rounded-lg py-2.5 pl-12 pr-12 sm:pr-24 focus:outline-none focus:ring-2 transition-all duration-0 text-base sm:text-lg ${isDark 
                ? 'bg-gray-800/50 border-gray-600/50 text-gray-200 placeholder-gray-400 focus:ring-purple-500/40 focus:border-purple-500/60' 
                : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500/40 focus:border-purple-500/60'}`}
            />
            <Search className={`absolute -mt-0.5 left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            {searchText && (
              <button
                type="button"
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                onClick={() => setSearchText("")}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Mobile: Stack buttons vertically, Desktop: Horizontal */}
          <div className="flex  justify-between flex-row gap-2 sm:gap-3">
            <button
              type="submit"
              className={`relative flex flex-row gap-2 sm:gap-3 justify-center items-center text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg transition-all duration-300 shadow-lg font-medium order-1 sm:order-none ${isDark 
                ? 'bg-gradient-to-r from-purple-700/50 to-indigo-700/50 hover:bg-purple-500/40' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'}`}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Search</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`relative flex whitespace-nowrap backdrop-blur-md flex-row gap-2 sm:gap-3 justify-center items-center  px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 font-medium order-2 sm:order-none ${isFilterOpen
                  ? isDark ? "text-white shadow-lg bg-gray-400/20 " : " shadow-lg bg-purple-500/20 backdrop-blur-md text-black"
                  : isDark ? "bg-gray-800/60 text-white" : "bg-black text-white"
                }`}
            >
              <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
              <span className="text-sm sm:text-base">{isFilterOpen ? "Hide" : "Show"} Filters</span>
              {activeFilterCount > 0 && (
                <span className={`text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center ${isDark 
                  ? 'bg-gradient-to-r from-purple-700/70 to-indigo-700/70' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600'}`}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* View Toggle */}
            <div className={`flex min-w-fit border rounded-lg shadow-md overflow-hidden order-3 sm:order-none ${isDark 
              ? 'bg-gray-900/80 border-gray-700' 
              : 'bg-white/90 border-gray-300'}`}>
              <button
                onClick={() => setViewMode && setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
                className={`p-2 sm:p-2.5 px-3 sm:px-4 transition-colors duration-300 flex items-center justify-center rounded-l-lg ${viewMode === "grid"
                    ? isDark ? "bg-gradient-to-r from-purple-700/70 to-indigo-700/70 text-white shadow-lg" : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                    : isDark ? "text-gray-500 hover:text-purple-400 hover:bg-gray-800" : "text-gray-600 hover:text-purple-600 hover:bg-gray-100"
                  }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setViewMode && setViewMode("list")}
                aria-pressed={viewMode === "list"}
                className={`p-2 sm:p-2.5 px-3 sm:px-4 transition-colors duration-300 flex items-center justify-center rounded-r-lg ${viewMode === "list"
                    ? isDark ? "bg-gradient-to-r from-purple-700/70 to-indigo-700/70 text-white shadow-lg" : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                    : isDark ? "text-gray-500 hover:text-purple-400 hover:bg-gray-800" : "text-gray-600 hover:text-purple-600 hover:bg-gray-100"
                  }`}
                title="List View"
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filters Panel */}
      {isFilterOpen && (
        <div className="mt-6 sm:mt-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            <FilterCustomDropDown
              title="Content Rating"
              multiple={true}
              options={filterOptions.ratings}
              selectedValues={activeFilters.rating ?? []}
              onSelectionChange={(value) => toggleFilter("rating", value)}
              countLabel="Any Rating"
              isDark={isDark}
            />

            <FilterCustomDropDown
              title="Publication Status"
              multiple={true}
              options={filterOptions.statuses}
              selectedValues={activeFilters.status ?? []}
              onSelectionChange={(value) => toggleFilter("status", value)}
              countLabel="Any Status"
              isDark={isDark}
            />

            <FilterCustomDropDown
              title="Language"
              multiple={true}
              options={filterOptions.languages}
              selectedValues={activeFilters.language ?? []}
              onSelectionChange={(value) => toggleFilter("language", value)}
              countLabel="Any Language"
              isDark={isDark}
            />

            <FilterCustomDropDown
              title="Publication Year"
              multiple={true}
              options={yearOptions}
              selectedValues={activeFilters.year ?? []}
              onSelectionChange={(value) => toggleFilter("year", value)}
              countLabel="Any Year"
              isDark={isDark}
            />

            <FilterCustomDropDown
              title="Demographic"
              multiple={true}
              options={filterOptions.demographics}
              selectedValues={activeFilters.demographic ?? []}
              onSelectionChange={(value) => toggleFilter("demographic", value)}
              countLabel="Any Demographic"
              isDark={isDark}
            />

            <FilterCustomDropDown
              title="Publication Type"
              multiple={true}
              options={filterOptions.publicationTypes}
              selectedValues={activeFilters.publicationType ?? []}
              onSelectionChange={(value) => toggleFilter("publicationType", value)}
              countLabel="Any Type"
              isDark={isDark}
            />

            <ThemeGenreTags
              activeFilters={activeFilters}
              filterOptions={filterOptions}
              toggleFilter={toggleFilter}
              isDark={isDark}
            />

            <FilterCustomDropDown
              title="Sort By"
              multiple={false}
              options={filterOptions.sortOptions}
              selectedValues={activeFilters.sortBy ?? ""}
              onSelectionChange={(value) => toggleFilter("sortBy", value)}
              countLabel="Default"
              isDark={isDark}
            />
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex mt-4 flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Results Info */}
        {searchQuery && (
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
              <span className={isDark ? "text-purple-400" : "text-purple-600"}>Results for </span>
              <span className={isDark ? "text-white" : "text-gray-900"}>{`"`}</span>
              <span className={isDark ? "text-gray-200" : "text-gray-700"}>{searchQuery}</span>
              <span className={isDark ? "text-white" : "text-gray-900"}>{`"`}</span>
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              {filteredResults?.length ?? 0} {(filteredResults?.length ?? 0) === 1 ? "result" : "results"} found
            </p>
          </div>
        )}
      </div>

    </div>
  </div>
);
}