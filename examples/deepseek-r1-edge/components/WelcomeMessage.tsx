export const WelcomeMessage = ({ 
  show, 
  t, 
  onEdgeOneAIBtnClick 
}: { 
  show: boolean; 
  t: (en: string) => string;
  onEdgeOneAIBtnClick: () => void;
}) => {
  if (!show) return null;

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="max-w-3xl px-4 mx-auto text-center">
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">
          {t('DeepSeek 671B on the Edge')}
        </h2>
        <p className="text-gray-600">
          {t(
            'EdgeOne AI is transforming user experience and operational efficiency by performing AI computations closer to end-users, ensuring ultra-low latency and consistently high performance.'
          )}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          {t('Available for free on ')}{' '}
          <button
            onClick={onEdgeOneAIBtnClick}
            className="mt-4 text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
          >
            EdgeOne Pages
          </button>
        </p>
      </div>
    </div>
  );
}; 