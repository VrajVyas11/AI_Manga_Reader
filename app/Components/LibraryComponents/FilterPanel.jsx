import {
    BookOpen,
    Star,
    Clock,
    X,
    SortAsc,
    TrendingUp,
    ArrowUpDown,
    Tag,
    Filter,
    XCircle,
    ClockAlert,
    CircleCheck,
    ListFilter,
    ArrowBigLeftDashIcon,
} from "lucide-react";
import filterOptions from "../../constants/filterOptions";

const baseButtonClasses =
    "flex items-center gap-2 p-2 rounded-lg text-xs font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1";

const activeButtonClasses =
    "bg-purple-700/50 text-white border border-transparent shadow-lg";

const inactiveButtonClasses =
    "text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-700";

export const FilterPanel = ({ filters, onFiltersChange, setIsFilterOpen }) => {
    const options = {
        genres: filterOptions.genres,
        formats: filterOptions.formats,
        themes: filterOptions.themes,
        content: filterOptions.content,
    };

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
        { value: "recent", label: "Recency", icon: Clock },
        { value: "rating", label: "Top Rated", icon: Star },
        { value: "popular", label: "Most Popular", icon: TrendingUp },
        { value: "title", label: "Title A-Z", icon: SortAsc },
        { value: "progress", label: "Progress", icon: ArrowUpDown },
    ];

    return (
        <div className="relative text-sm shadow-lg">
            <div className="flex mb-5 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-700/40 p-4 rounded-full shadow-md">
                        <Filter className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Filter</h2>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                            Filter Reading History
                        </p>
                    </div>
                </div>
                <div className=" flex flex-row gap-3  items-center">
                    <button
                        onClick={() =>
                            setIsFilterOpen(prev => !prev)
                        }
                        className="flex w-full justify-center items-center gap-1 px-2 py-2 bg-purple-800/50  text-white hover:text-purple-300 rounded-full transition-shadow shadow-sm border border-purple-700 focus:outline-none"
                        aria-label="Collapse"
                    >
                        <ArrowBigLeftDashIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() =>
                            onFiltersChange({ genre: [], status: "all", sort: "recent" })
                        }
                        className="flex w-full justify-center items-center gap-1 px-2 py-2 bg-red-800/50  text-white hover:text-red-300 rounded-full transition-shadow shadow-sm border border-red-700 focus:outline-none"
                        aria-label="Clear all filters"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className=" overflow-y-auto pr-2 custom-scrollbar space-y-6">
                {/* Genres */}
                <FilterCategory
                    title="Genres"
                    icon={Tag}
                    options={options.genres}
                    selected={filters.genre}
                    onToggle={(label) => {
                        const newGenres = filters.genre.includes(label)
                            ? filters.genre.filter((g) => g !== label)
                            : [...filters.genre, label];
                        onFiltersChange({ ...filters, genre: newGenres });
                    }}
                />

                {/* Formats */}
                <FilterCategory
                    title="Formats"
                    icon={Tag}
                    options={options.formats}
                    selected={filters.genre}
                    onToggle={(label) => {
                        const newGenres = filters.genre.includes(label)
                            ? filters.genre.filter((g) => g !== label)
                            : [...filters.genre, label];
                        onFiltersChange({ ...filters, genre: newGenres });
                    }}
                />

                {/* Themes */}
                <FilterCategory
                    title="Themes"
                    icon={Tag}
                    options={options.themes}
                    selected={filters.genre}
                    onToggle={(label) => {
                        const newGenres = filters.genre.includes(label)
                            ? filters.genre.filter((g) => g !== label)
                            : [...filters.genre, label];
                        onFiltersChange({ ...filters, genre: newGenres });
                    }}
                />

                {/* Content */}
                <FilterCategory
                    title="Content"
                    icon={Tag}
                    options={options.content}
                    selected={filters.genre}
                    onToggle={(label) => {
                        const newGenres = filters.genre.includes(label)
                            ? filters.genre.filter((g) => g !== label)
                            : [...filters.genre, label];
                        onFiltersChange({ ...filters, genre: newGenres });
                    }}
                />

                {/* Status */}
                <div>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
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
                                    type="button"
                                >
                                    <Icon className="w-5 h-5" />
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Sort By */}
                <div>
                    <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <ListFilter className="w-5 h-5" />
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
                                    type="button"
                                >
                                    <Icon className="w-5 h-5" />
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

const FilterCategory = ({ title, icon: Icon, options, selected, onToggle }) => (
    <div>
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {title}
        </h3>
        <ul className="flex flex-wrap gap-2 max-h-44 overflow-y-auto custom-scrollbar">
            {options.map(({ label }) => {
                const isSelected = selected.includes(label);
                return (
                    <li
                        key={label}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        onClick={() => onToggle(label)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                onToggle(label);
                            }
                        }}
                        className={`cursor-pointer select-none rounded-md border px-3 py-1 text-xs font-medium transition-colors duration-200 flex items-center gap-1 ${isSelected
                            ? "bg-gradient-to-r from-purple-700 to-pink-600 border-transparent text-white shadow-md"
                            : "border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`}
                    >
                        {label}
                    </li>
                );
            })}
        </ul>
    </div>
);