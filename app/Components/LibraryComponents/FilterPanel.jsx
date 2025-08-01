import {
  Clock,
  Star,
  Filter,
  X,
  BookOpen,
  SortAsc,
  TrendingUp,
  ArrowUpDown,
  Tag,
  XCircle,
  ClockAlert,
  CircleCheck,
  ListFilter,
  ArrowBigLeftDashIcon,
  Trash,
} from "lucide-react";

import filterOptions from "../../constants/filterOptions";

const FilterPanel = ({ filters, onFiltersChange, setIsFilterOpen, onClose }) => {
  const baseButtonClasses =
    "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-0";
  const activeButtonClasses =
    "bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-lg shadow-purple-900/50";
  const inactiveButtonClasses =
    "text-gray-400 bg-gray-950 border border-gray-800 hover:bg-gray-800 hover:text-white";

  const statusIconMap = {
    ongoing: Clock,
    completed: CircleCheck,
    hiatus: ClockAlert,
    cancelled: XCircle,
  };

  const statusOptions = filterOptions.statuses.map((status) => ({
    value: status.id,
    label: status.label,
    icon: statusIconMap[status.id] || BookOpen,
    color: status.color,
  }));

  const sortOptions = [
    { value: "recent", label: "Recent", icon: Clock },
    { value: "rating", label: "Top Rated", icon: Star },
    { value: "popular", label: "Popular", icon: TrendingUp },
    { value: "title", label: "A-Z", icon: SortAsc },
    { value: "progress", label: "Progress", icon: ArrowUpDown },
  ];

  const FilterCategory = ({ title, icon: Icon, options, selected, onToggle }) => (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
        <Icon className="w-5 h-5 text-purple-400 drop-shadow-md" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto custom-scrollbar scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-gray-900 rounded-md px-1 py-1  shadow-inner">
        {options.map(({ label }) => {
          const isSelected = selected?.includes(label);
          return (
            <button
              key={label}
              onClick={() => onToggle(label)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors duration-300 select-none ${
                isSelected
                  ? "bg-purple-700 text-white shadow-md shadow-purple-900/50"
                  : "bg-gray-900/70 text-gray-300 hover:bg-purple-700 hover:text-white"
              }`}
              aria-pressed={isSelected}
              aria-label={`${isSelected ? "Deselect" : "Select"} ${label}`}
              type="button"
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );

  return (
    <aside className="relative bg-black/95 backdrop-blur-md border border-gray-800 rounded-2xl p-6 pt-9 shadow-2xl max-w-sm w-full">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-purple-900 to-purple-700 p-3 rounded-lg shadow-lg">
            <Filter className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
          <div>
            <h2 className="text-lg mb-1 font-extrabold text-white tracking-wide leading-tight">
              Filters
            </h2>
            <p className="text-xs min-w-fit text-gray-400 uppercase tracking-wider">
              Refine your collection
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              onFiltersChange({
                genre: [],
                format: [],
                theme: [],
                content: [],
                status: "all",
                sort: "recent",
              })
            }
            className="flex items-center gap-1 px-3 py-3 rounded-lg text-xs font-semibold bg-red-700/30 text-red-400 hover:bg-red-700/50 hover:text-white transition-shadow shadow-red-700/40 focus:outline-none "
            title="Clear all filters"
            type="button"
          >
            <Trash className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={onClose}
            className="p-2 absolute right-1 top-1 rounded-lg bg-white/50 text-black  transition-shadow shadow-md focus:outline-none "
            title="Close filter panel"
            type="button"
          >
            <X  strokeWidth={3} className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="space-y-6 max-h-[360px] overflow-y-auto custom-scrollbar scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-gray-900 pr-2">
        <FilterCategory
          title="Genres"
          icon={Tag}
          options={filterOptions.genres}
          selected={filters.genre}
          onToggle={(label) => {
            const newGenres = filters.genre.includes(label)
              ? filters.genre.filter((g) => g !== label)
              : [...filters.genre, label];
            onFiltersChange({ ...filters, genre: newGenres });
          }}
        />

        <FilterCategory
          title="Formats"
          icon={Tag}
          options={filterOptions.formats}
          selected={filters.format}
          onToggle={(label) => {
            const newFormats = filters.format.includes(label)
              ? filters.format.filter((f) => f !== label)
              : [...filters.format, label];
            onFiltersChange({ ...filters, format: newFormats });
          }}
        />

        <FilterCategory
          title="Themes"
          icon={Tag}
          options={filterOptions.themes}
          selected={filters.theme}
          onToggle={(label) => {
            const newThemes = filters.theme.includes(label)
              ? filters.theme.filter((t) => t !== label)
              : [...filters.theme, label];
            onFiltersChange({ ...filters, theme: newThemes });
          }}
        />

        <FilterCategory
          title="Content"
          icon={Tag}
          options={filterOptions.content}
          selected={filters.content}
          onToggle={(label) => {
            const newContent = filters.content.includes(label)
              ? filters.content.filter((c) => c !== label)
              : [...filters.content, label];
            onFiltersChange({ ...filters, content: newContent });
          }}
        />

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400 drop-shadow-md" />
            Status
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {statusOptions.map(({ value, label, icon: Icon }) => {
              const active = filters.status === value;
              return (
                <button
                  key={value}
                  onClick={() => onFiltersChange({ ...filters, status: value })}
                  className={`${baseButtonClasses} ${
                    active ? activeButtonClasses : inactiveButtonClasses
                  }`}
                  aria-pressed={active}
                  aria-label={`Set status filter to ${label}`}
                  type="button"
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ListFilter className="w-5 h-5 text-purple-400 drop-shadow-md" />
            Sort By
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {sortOptions.map(({ value, label, icon: Icon }) => {
              const active = filters.sort === value;
              return (
                <button
                  key={value}
                  onClick={() => onFiltersChange({ ...filters, sort: value })}
                  className={`${baseButtonClasses} ${
                    active ? activeButtonClasses : inactiveButtonClasses
                  }`}
                  aria-pressed={active}
                  aria-label={`Sort by ${label}`}
                  type="button"
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </aside>
  );
};

export default FilterPanel;