import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Search } from 'lucide-react';
import { ChevronDown } from "lucide-react"
const FilterSection = ({ title, items, activeFilters, toggleFilter, searchTerm }) => {
    // Filter items based on search term
    const filteredItems = useMemo(() => {
        if (!searchTerm) return items;
        return items.filter((item) =>
            item.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [items, searchTerm]);

    if (filteredItems.length === 0) return null;

    return (
        <div className="space-y-1">
            <div className="flex gap-2 items-center">
                <span className="capitalize text-lg text-gray-200 select-none">{title}</span>
                <hr className="border-1 my-4 border-gray-600 flex-grow" />
            </div>
            <ul className="flex gap-2 flex-wrap">
                {filteredItems.map((tag) => (
                    <li
                        key={tag.id}
                        onClick={() => toggleFilter('genres', tag.label)}
                        className={`transition-all  cursor-pointer rounded-md px-1 border flex items-center gap-1 text-gray-300
              ${activeFilters.genres?.includes(tag.label)
                                ? 'border-solid border-purple-500 outline outline-1 outline-purple-500 bg-gray-700'
                                : 'border-dashed border-gray-500 hover:bg-gray-700'
                            }`}
                        role="button"
                        aria-pressed={activeFilters.genres?.includes(tag.label)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleFilter('genres', tag.label);
                            }
                        }}
                    >
                        <div className="px-1 my-auto text-center">
                            <span className="my-auto select-none text-xs relative bottom-[1px]">
                                {tag.label}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

function ThemeGenreTags({ filterOptions, toggleFilter, activeFilters }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showTags, setShowTags] = useState(false);
    // Clear all selected tags
    const resetFilters = () => {
        setSearchTerm('');
        activeFilters.genres?.forEach((value) => toggleFilter('genres', value));
    };
    const toggleDropdown = () => {
        setShowTags(!showTags);
    };

    return (
        <div className="filter-group space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 animate-pulse"></div>
                    <h3 className="text-sm font-semibold text-gray-200 tracking-wide">Show Tags</h3>
                  </div>
            
                  <div className="relative">
                    <button
                      onClick={toggleDropdown}
                      className={`w-full group relative overflow-hidden bg-gray-950/50 backdrop-blur-sm border rounded-xl p-3 transition-all duration-300 hover:bg-gray-900/70 ${showTags
                        ? 'border-purple-500/60  bg-gray-900/70'
                        : 'border-gray-700/60 hover:border-gray-600/80'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 text-left">
                          <div className="text-sm text-gray-300 flex flex-wrap items-center gap-4 min-h-[20px]">
                            {activeFilters.genres.length > 0 ? activeFilters.genres.map((val, index) => <span key={index} className='mr-2 capitalize'>{val.charAt(0).toUpperCase() + val.slice(1)}</span>) : "Any Tag"}
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ml-2 flex-shrink-0 ${showTags ? 'rotate-180' : 'group-hover:text-gray-300'
                          }`} />
                      </div>
                    </button>
                {showTags &&
                    <div
                        style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "rgba(155, 89, 182, 0.6) rgba(0, 0, 0, 0.1)",
                        }}
                        className=' absolute  z-50  max-h-52 p-3 bg-black/90  w-full mt-2  backdrop-blur-md border border-purple-800/50 rounded-lg overflow-y-scroll  transition-all duration-300'>
                        {/* Search and Reset */}
                        <div className="relative grid gap-2 lg:grid-cols-[1fr_auto]">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="block w-full my-1 tracking-wide bg-gray-700 outline-none outline-1 outline-transparent focus:outline-purple-500 transition-[outline-color] text-sm py-2 pl-8 rounded-md text-gray-200 placeholder-gray-400"
                                    placeholder="Search tags"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    aria-label="Search tags"
                                />
                                <Search className="absolute left-3 top-[0.875rem] w-4 h-4 pointer-events-none text-gray-100 " />
                            </div>
                            <button
                                disabled={searchTerm.trim() == ""}
                                onClick={resetFilters}
                                className="my-auto disabled:opacity-45  rounded relative flex items-center px-3 overflow-hidden bg-red-600/80 hover:bg-red-500 text-white text-sm h-[2.2rem] min-h-[1.75rem] min-w-[1.75rem]"
                                aria-label="Reset filters"
                            >
                                <span className="flex tracking-wide relative items-center justify-center font-bold text-xs select-none w-full">
                                    Reset
                                </span>
                            </button>
                        </div>

                        {/* Filter Sections */}
                        <FilterSection
                            title="Formats"
                            items={filterOptions.formats}
                            activeFilters={activeFilters}
                            toggleFilter={toggleFilter}
                            searchTerm={searchTerm}
                        />
                        <FilterSection
                            title="Genres"
                            items={filterOptions.genres}
                            activeFilters={activeFilters}
                            toggleFilter={toggleFilter}
                            searchTerm={searchTerm}
                        />
                        <FilterSection
                            title="Themes"
                            items={filterOptions.themes}
                            activeFilters={activeFilters}
                            toggleFilter={toggleFilter}
                            searchTerm={searchTerm}
                        />
                        <FilterSection
                            title="Content"
                            items={filterOptions.content}
                            activeFilters={activeFilters}
                            toggleFilter={toggleFilter}
                            searchTerm={searchTerm}
                        />
                    </div>}
            </div>
        </div>
    );
}

ThemeGenreTags.propTypes = {
    filterOptions: PropTypes.shape({
        genres: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired,
            })
        ).isRequired,
        themes: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired,
            })
        ).isRequired,
        content: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired,
            })
        ).isRequired,
        formats: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired,
            })
        ).isRequired,
    }).isRequired,
    toggleFilter: PropTypes.func.isRequired,
    activeFilters: PropTypes.shape({
        genres: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
};

export default ThemeGenreTags;