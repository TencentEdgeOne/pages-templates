/* eslint-disable react/no-unescaped-entities */
import React from 'react';

interface FAQItem {
  question: string;
  answer: any;
}

const faqData: FAQItem[] = [
  {
    question: 'How can I customize the resume template?',
    answer:
      "To customize the resume, edit the 'resumeData.json' file in the 'app/data/' directory. Modify the JSON structure to include your personal information, skills, experience, and education. The template will automatically update with your changes.",
  },
  {
    question: 'How can I deploy my resume online?',
    answer: (
      <>
        <p>
          For easy deployment, use{' '}
          <a
            href="https://edgeone.ai/products/pages"
            target="_blank"
            className="text-blue-600 underline hover:text-blue-800"
          >
            OpenEdge Pages
          </a>
          . It offers free resume hosting and simple setup. Just follow the
          instructions in the project's README.md file. You can quickly showcase
          your professional profile online.
        </p>
      </>
    ),
  },
];

const FAQ: React.FC = () => {
  const createMarkup = (html: string) => ({ __html: html });

  const linkifyAnswer = (answer: string) => {
    return answer.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" class="text-blue-600 hover:underline">$1</a>'
    );
  };

  return (
    <section className="w-full p-8 mx-auto mt-16 bg-gray-100 rounded-lg shadow-md">
      <div className="space-y-6">
        {faqData.map((item, index) => (
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

export default FAQ;
