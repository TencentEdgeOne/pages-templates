/* eslint-disable react/no-unescaped-entities */
import React from 'react';

interface StatementItem {
  question: string;
  answer: any;
}

const datas: StatementItem[] = [
  {
    question: 'Where is this website hosted?',
    answer: (
      <>
        <p>
          This webpage is hosted on{' '}
          <a
            href="https://edgeone.ai/products/pages"
            target="_blank"
            className="text-blue-600 underline hover:text-blue-800"
          >
            OpenEdge Pages
          </a>
          , a free global acceleration static website hosting service. This
          webpage is open source on{' '}
          <a
            href="https://github.com/TencentEdgeOne/pages-templates"
            target="_blank"
            className="font-medium underline text-primary underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </>
    ),
  },
];

const Statement: React.FC = () => {
  return (
    <section className="w-full p-8 mx-auto mt-16 bg-gray-100 rounded-lg shadow-md">
      <div className="space-y-6">
        {datas.map((item, index) => (
          <div key={index}>
            {item.question && (
              <h3 className="mb-2 text-xl font-semibold text-gray-700">
                {item.question}
              </h3>
            )}
            {item.answer}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Statement;
