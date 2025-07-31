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
} from "lucide-react";

import filterOptions from "../../constants/filterOptions";

const FilterPanel = ({ filters, onFiltersChange, setIsFilterOpen, onClose }) => {
  const baseButtonClasses =
    "flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500/50";
  const activeButtonClasses =
    "bg-purple-800 text-white shadow-md";
  const inactiveButtonClasses =
    "text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-700 hover:border-gray-600";

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
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-1.5">
        <Icon className="w-4 h-4 text-purple-400" />
        {title}
      </h3>
      <div className="flex flex-wrap gap-1 max-h-28 custom-scrollbar overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {options.map(({ label }) => {
          const isSelected = selected?.includes(label);
          return (
            <button
              key={label}
              onClick={() => onToggle(label)}
              className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors duration-200 ${
                isSelected
                  ? "bg-purple-700/50 text-white shadow-sm"
                  : "bg-gray-950 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="relative bg-gray-950/95 backdrop-blur-sm border border-gray-700 rounded-xl p-5 shadow-lg max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-purple-900 p-2 rounded-lg shadow-md">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">Filters</h2>
            <p className="text-[10px] text-gray-400">Refine your collection</p>
          </div>
        </div>
        <div className="flex gap-1">
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
            className="p-1.5 text-xs flex justify-center items-center gap-1 bg-red-700/20 hover:bg-red-700/30 text-red-400 rounded-lg transition duration-200 border border-red-700/30"
            title="Clear filters"
          >
            <X className="w-4 h-4" /> Clear
          </button>
          <button
            onClick={onClose}
            className="p-1.5 bg-gray-800/60 hover:bg-gray-700 text-gray-300 rounded-lg transition duration-200"
            title="Close filters"
          >
            <ArrowBigLeftDashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-5 max-h-80 custom-scrollbar overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-1">
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

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            Status
          </h3>
          <div className="grid grid-cols-2 gap-1">
            {statusOptions.map(({ value, label, icon: Icon }) => {
              const active = filters.status === value;
              return (
                <button
                  key={value}
                  onClick={() => onFiltersChange({ ...filters, status: value })}
                  className={`${baseButtonClasses} ${
                    active ? activeButtonClasses : inactiveButtonClasses
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
            <ListFilter className="w-4 h-4 text-purple-400" />
            Sort By
          </h3>
          <div className="grid grid-cols-2 gap-1">
            {sortOptions.map(({ value, label, icon: Icon }) => {
              const active = filters.sort === value;
              return (
                <button
                  key={value}
                  onClick={() => onFiltersChange({ ...filters, sort: value })}
                  className={`${baseButtonClasses} ${
                    active ? activeButtonClasses : inactiveButtonClasses
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;