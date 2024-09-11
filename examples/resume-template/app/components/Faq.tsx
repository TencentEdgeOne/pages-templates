import React from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How can I customize the resume template?",
    answer: "To customize the resume, edit the 'resumeData.json' file in the 'app/data/' directory. Modify the JSON structure to include your personal information, skills, experience, and education. The template will automatically update with your changes."
  },
  {
    question: "How can I deploy my resume online?",
    answer: "For a seamless deployment experience, you can utilize https://edgeone.ai . This platform offers free hosting for your resume. To get started, simply follow the step-by-step deployment instructions provided in the 'README.md' file of this project. EdgeOne.ai streamlines the process, allowing you to showcase your professional profile online quickly and efficiently."
  }
];

const FAQ: React.FC = () => {
  const createMarkup = (html: string) => ({ __html: html });

  const linkifyAnswer = (answer: string) => {
    return answer.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>'
    );
  };

  return (
    <section className="max-w-4xl mx-auto mt-16 p-8 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
      <div className="space-y-6">
        {faqData.map((item, index) => (
          <div key={index}>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{item.question}</h3>
            <p 
              className="text-gray-600"
              dangerouslySetInnerHTML={createMarkup(linkifyAnswer(item.answer))}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;