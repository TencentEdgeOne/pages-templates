export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="pt-20  px-6 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-6 [text-fill-color:transparent] [-webkit-text-fill-color:transparent]">
            EdgeOne Pages MCP
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto mb-10">
            Quickly deploy HTML content to EdgeOne Pages and get a public access link
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-800 dark:text-white">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
              Rapid Deployment
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Simple and efficient HTML content deployment via MCP protocol
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
              Public Access
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Automatically generate public access links to share your content anytime, anywhere
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">
              Edge Storage
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Uses EdgeOne Pages KV storage for faster access speeds
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-800 dark:text-white">
          How It Works
        </h2>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <ol className="space-y-6">
              <li className="flex">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold mr-4">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-800 dark:text-white mb-1">
                    Submit HTML Content
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Submit your HTML content using the MCP service's deploy-html tool
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold mr-4">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-800 dark:text-white mb-1">
                    Deploy to EdgeOne
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    The service automatically connects to EdgeOne Pages API and deploys content
                  </p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold mr-4">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-800 dark:text-white mb-1">
                    Get Public Link
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Immediately receive a publicly accessible URL link
                  </p>
                </div>
              </li>
            </ol>
          </div>
          <div className="order-1 md:order-2">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="font-mono text-sm bg-slate-100 dark:bg-slate-900 p-4 rounded-lg text-slate-800 dark:text-slate-300 overflow-x-auto">
                <div className="text-purple-600 dark:text-purple-400">
                  // Configure MCP
                </div>
                <div className="mt-2">
                  <span className="text-red-500 dark:text-red-400">{`{`}</span>
                </div>
                <div className="mt-2 ml-4">
                  <span className="text-blue-600 dark:text-blue-400">"mcpServers"</span>:{' '}
                  <span className="text-red-500 dark:text-red-400">{`{`}</span>
                </div>
                <div className="mt-2 ml-8">
                  <span className="text-blue-600 dark:text-blue-400">"edgeone-pages-mcp-server"</span>:{' '}
                  <span className="text-red-500 dark:text-red-400">{`{`}</span>
                </div>
                <div className="mt-2 ml-12">
                  <span className="text-blue-600 dark:text-blue-400">"command"</span>:{' '}
                  <span className="text-orange-500 dark:text-orange-400">"npx"</span>,
                </div>
                <div className="mt-2 ml-12">
                  <span className="text-blue-600 dark:text-blue-400">"args"</span>:{' '}
                  <span className="text-green-600 dark:text-green-400">[</span>
                  <span className="text-orange-500 dark:text-orange-400">"edgeone-pages-mcp"</span>
                  <span className="text-green-600 dark:text-green-400">]</span>
                </div>
                <div className="mt-2 ml-8">
                  <span className="text-red-500 dark:text-red-400">{`}`}</span>
                </div>
                <div className="mt-2 ml-4">
                  <span className="text-red-500 dark:text-red-400">{`}`}</span>
                </div>
                <div className="mt-2">
                  <span className="text-red-500 dark:text-red-400">{`}`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-10 text-center shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Using EdgeOne Pages Now
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Quickly deploy your HTML content, get public access links, and enjoy the ultimate experience of EdgeOne Pages
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="https://edgeone.ai/products/pages"
              target="_blank"
              className="bg-white text-purple-700 font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-300"
            >
              Learn More
            </a>
            <a
              href="https://edgeone.ai/document/160427672992178176"
              target="_blank"
              className="bg-transparent border-2 border-white text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-white/10 transition-all duration-300"
            >
              View Documentation
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} EdgeOne Pages.
          </p>
        </div>
      </footer>
    </main>
  );
}
