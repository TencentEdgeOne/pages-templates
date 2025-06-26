export const SearchingIndicator = ({ 
  isSearching, 
  t 
}: { 
  isSearching: boolean; 
  t: (en: string) => string;
}) => {
  if (!isSearching) return null;

  return (
    <div className="mb-2">
      <div className="flex items-center justify-center w-full px-3 py-2 text-sm text-gray-600 bg-white rounded-lg shadow-sm border border-gray-100">
        <svg
          className="w-4 h-4 mr-2 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {t('Processing')}
      </div>
    </div>
  );
}; 