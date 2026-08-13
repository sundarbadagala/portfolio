export default function SubCategoryCard({ sub }: any) {
    return (
        <>
            <div className="flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 text-lg shadow-sm border border-neutral-200/40 dark:border-neutral-800/45 group-hover:scale-105 transition-transform">
                    📂
                </span>
                <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {sub}
                </h4>
            </div>
            <span className="text-neutral-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all text-sm font-semibold">→</span>
        </>
    )
}