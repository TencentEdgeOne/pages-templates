export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between w-full h-16 px-3 pt-4 mt-5 mb-3 space-y-3 text-center sm:mb-0 sm:h-20 sm:flex-row sm:pt-2">
      <div>
        <div className="font-medium">
          Built with{" "}
          <a
            href="https://api-docs.deepseek.com/"
            className="font-semibold text-blue-600 transition underline-offset-4 hover:text-gray-700 hover:underline"
            target="_blank"
          >
            Deepseek API
          </a>{" "}
          and{" "}
          <a
            href="https://github.com/nutlope/llamacoder"
            className="font-semibold text-blue-600 transition underline-offset-4 hover:text-gray-700 hover:underline"
            target="_blank"
          >
            Inspired on Llamacoder
          </a>
          .
        </div>
      </div>
      <div className="flex pb-4 space-x-4 sm:pb-0"></div>
    </footer>
  );
}
