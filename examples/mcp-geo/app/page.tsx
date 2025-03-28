export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MCP with Pages Functions ：Geo Location Demo
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A geolocation service example demonstrating how to obtain user
            location information in EdgeOne Pages and interact with AI models
            through the MCP protocol.
          </p>
        </div>

        {/* Project Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Project Overview
          </h2>
          <p className="text-gray-600 mb-4">
            In modern web applications, obtaining user geolocation information
            is a common requirement. This project demonstrates how to:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>
              Securely obtain user geolocation using EdgeOne Pages Functions
            </li>
            <li>
              Enable AI models to access location data through the MCP protocol
            </li>
            <li>Elegantly display location information in the frontend</li>
          </ul>
        </div>

        {/* Core Features */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Core Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                EdgeOne Pages Functions
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>
                  • Automatically retrieve visitor&apos;s geolocation
                  information
                </li>
                <li>
                  • Includes detailed data about country, region, city, etc.
                </li>
                <li>
                  • Precise positioning through EdgeOne&apos;s global node
                  network
                </li>
                <li>• Returns standardized JSON format data</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                MCP Protocol Integration
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Implements Model Context Protocol standard</li>
                <li>• Provides get_geolocation tool interface</li>
                <li>
                  • Supports real-time AI model calls to geolocation service
                </li>
                <li>• Convenient server-side integration solution</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="text-center space-y-4">
          <a
            href="https://edgeone.ai/pages/new?template=mcp-geo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Deploy your own instance of the MCP Geo Location Service"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 mr-4"
          >
            Deploy Now
          </a>
          <a
            href="https://edgeone.ai/pages/templates"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View more EdgeOne Pages templates"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            View More Templates
          </a>
        </div>
      </div>
    </div>
  );
}
