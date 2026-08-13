import { Search } from "lucide-react";

interface QAndASearchProps {
    handleSearch: (value: string) => void;
    searchQuery: string;
}

function QAndASearch({ handleSearch, searchQuery }: QAndASearchProps) {
    return (
        <div className="mt-8 relative max-w-md">
            <input
                type="text"
                placeholder="Search technology categories..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-5 py-3 pl-12 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all shadow-sm text-sm"
            />
            <Search className="absolute left-4 top-3.5 text-neutral-400 dark:text-neutral-500" size={18} />
        </div>
    )
}

export default QAndASearch;