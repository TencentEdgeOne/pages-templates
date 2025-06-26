export const ScrollToBottomButton = ({ 
  isVisible, 
  onClick 
}: { 
  isVisible: boolean; 
  onClick: () => void; 
}) => {
  return (
    <div className={`flex justify-center transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
    }`}>
      <button
        onClick={onClick}
        className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 hover:scale-105 transition-all duration-200"
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </button>
    </div>
  );
}; 