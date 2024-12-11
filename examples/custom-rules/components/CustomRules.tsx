import React from 'react';

const ruleTests = [
  {
    category: 'Headers',
    tests: [
      {
        title: 'Full URL match',
        description: '/man/sim',
        path: '/man/sim',
      },
      {
        title: 'Route Parameters',
        description: '/user/:name',
        path: '/user/sim',
      },
      {
        title: 'Multiple Route Parameters',
        description: '/customer/:sex/:name',
        path: '/customer/male/sim',
      },
      {
        title: 'Match files with specific extensions',
        description: '/avatar/*.jpg',
        path: '/avatar/1.jpg',
      },
      {
        title: 'Match files with wildcard',
        description: '/assets/*/party.jpg',
        path: '/assets/dinner/party.jpg',
      },
      {
        title: 'URL with wildcard',
        description: '/name/*',
        path: '/name/sim',
      },
      {
        title: 'URL Encoding with wildcard',
        description: '/%E6%A0%87%E5%A4%B4*',
        path: '/%E6%A0%87%E5%A4%B4test',
      },
    ],
  },
  {
    category: 'Redirects',
    tests: [
      {
        title: 'Redirection with wildcard',
        description: '/redirect-a/*.jpg',
        path: '/redirect-a/1.jpg',
      },
      {
        title: 'Redirection with route parameters',
        description: '/redirect-b/:id',
        path: '/redirect-b/123',
      },
      {
        title: 'Redirection with multiple route parameters',
        description: '/redirect-c/:id/:name',
        path: '/redirect-c/123/sim',
      },
      {
        title: 'Redirection base example',
        description: '/redirect-d/hello',
        path: '/redirect-d/hello',
      },
      {
        title: 'Redirection base example',
        description: '/redirect-d/hello',
        path: '/redirect-d/hello',
      },
      {
        title: 'Redirection with route parameters and wildcard',
        description: '/rewrite-f/*/:name',
        path: '/rewrite-f/hello/sim',
      },
    ],
  },
  {
    category: 'Rewrites',
    tests: [
      {
        title: 'Rewrite with wildcard',
        description: '/rewrite-a/*.jpg',
        path: '/rewrite-a/1.jpg',
      },
      {
        title: 'Rewrite with route parameters',
        description: '/rewrite-b/:id',
        path: '/rewrite-b/1',
      },
    ],
  },
];

export function CustomRules() {
  return (
    <div className="min-h-screen p-8 text-white bg-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Custom Rules Testing</h1>

        <div className="grid gap-8">
          {ruleTests.map((category) => (
            <section key={category.category} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-400">
                {category.category}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {category.tests.map((test) => (
                  <a
                    key={test.title}
                    href={test.path}
                    target="_blank"
                    className="block p-6 transition-all duration-200 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-700 hover:transform hover:-translate-y-1"
                  >
                    <h3 className="mb-2 text-lg font-medium">{test.title}</h3>
                    <p className="mb-4 text-sm text-gray-400">
                      {test.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <code className="px-2 py-1 text-sm bg-gray-800 rounded">
                        {test.path}
                      </code>
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
