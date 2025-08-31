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
  Trash,
} from "lucide-react";

import filterOptions from "../../constants/filterOptions";

const FilterPanel = ({ filters, onFiltersChange, onClose, isDark }) => {
  const baseButtonClasses =
    "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-0";
  const activeButtonClasses = isDark
    ? "bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-lg shadow-purple-900/50"
    : "bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-md shadow-purple-600/40";
  const inactiveButtonClasses = isDark
    ? "text-gray-400 bg-gray-950 border border-gray-800 hover:bg-gray-800 hover:text-white"
    : "text-gray-700 bg-gray-100 border border-gray-300 hover:bg-purple-400 hover:text-white";

  const statusIconMap = {
    ongoing: Clock,
    completed: CircleCheck,
    hiatus: ClockAlert,
    cancelled: XCircle,
  };

  const statusOptions = filterOptions.statuses.map((status) => ({
    value: status.id,
    label: status.label,
    icon: statusIconMap[status.id] ?? BookOpen,
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
      <h3
        className={`text-sm font-semibold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"
          }`}
      >
        <Icon
          className={`w-5 h-5 ${isDark ? "text-purple-400 drop-shadow-md" : "text-purple-600"
            }`}
        />
        {title}
      </h3>
      <div
        className={`flex flex-wrap gap-2 max-h-28 overflow-y-auto rounded-md px-1 py-1 ${isDark
            ? "bg-gray-900/70 text-gray-300 shadow-inner scrollbar-thumb-purple-700 scrollbar-track-gray-900"
            : "bg-white text-gray-800 scrollbar-thumb-purple-400 scrollbar-track-gray-200"
          } custom-scrollbar scrollbar-thin`}
      >
        {options.map(({ label }) => {
          const isSelected = selected?.includes(label);
          return (
            <button
              key={label}
              onClick={() => onToggle(label)}
              className={`${baseButtonClasses} ${isSelected ? activeButtonClasses : inactiveButtonClasses
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
    <aside
      className={`relative rounded-2xl p-6 pt-9 max-w-sm w-full shadow-2xl ${isDark
          ? "bg-black/95 backdrop-blur-md border border-gray-800"
          : "bg-white shadow-md border border-gray-300"
        }`}
    >
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-lg shadow-lg ${isDark ? "bg-gradient-to-tr from-purple-900 to-purple-700" : "bg-purple-400"
              }`}
          >
            <Filter
              className={`w-6 h-6 ${isDark ? "text-white drop-shadow-lg" : "text-white"
                }`}
            />
          </div>
          <div>
            <h2
              className={`text-lg mb-1 font-extrabold tracking-wide leading-tight ${isDark ? "text-white" : "text-gray-900"
                }`}
            >
              Filters
            </h2>
            <p
              className={`text-xs min-w-fit uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-600"
                }`}
            >
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
            className={`flex items-center gap-1 px-3 py-3 rounded-lg text-xs font-semibold transition-shadow focus:outline-none ${isDark
                ? "bg-red-700/30 text-red-400 hover:bg-red-700/50 hover:text-white shadow-red-700/40"
                : "bg-red-200 text-red-700 hover:bg-red-400 hover:text-white shadow-red-400/40"
              }`}
            title="Clear all filters"
            type="button"
          >
            <Trash className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={onClose}
            className={`p-2 absolute right-1 top-1 rounded-lg transition-shadow focus:outline-none ${isDark ? "bg-white/50 text-black shadow-md" : "bg-gray-200 text-black"
              }`}
            title="Close filter panel"
            type="button"
          >
            <X strokeWidth={3} className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div
        className={`space-y-6 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar scrollbar-thin ${isDark
            ? "scrollbar-thumb-purple-700 scrollbar-track-gray-900"
            : "scrollbar-thumb-purple-400 scrollbar-track-gray-200"
          }`}
      >
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
          <h3
            className={`text-sm font-semibold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"
              }`}
          >
            <TrendingUp
              className={`w-5 h-5 ${isDark ? "text-purple-400 drop-shadow-md" : "text-purple-600"
                }`}
            />
            Status
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {statusOptions.map(({ value, label, icon: Icon }) => {
              const active = filters.status === value;
              return (
                <button
                  key={value}
                  onClick={() => onFiltersChange({ ...filters, status: value })}
                  className={`${baseButtonClasses} ${active ? activeButtonClasses : inactiveButtonClasses
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
          <h3
            className={`text-sm font-semibold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"
              }`}
          >
            <ListFilter
              className={`w-5 h-5 ${isDark ? "text-purple-400 drop-shadow-md" : "text-purple-600"
                }`}
            />
            Sort By
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {sortOptions.map(({ value, label, icon: Icon }) => {
              const active = filters.sort === value;
              return (
                <button
                  key={value}
                  onClick={() => onFiltersChange({ ...filters, sort: value })}
                  className={`${baseButtonClasses} ${active ? activeButtonClasses : inactiveButtonClasses
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