export const Loading = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-pulse"></div>
      <div className="w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-pulse delay-150"></div>
      <div className="w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-pulse delay-300"></div>
    </div>
  );
}; 