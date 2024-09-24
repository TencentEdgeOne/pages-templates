import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Faq() {
  const items = [
    {
      id: 'What is Chrome built-in AI?',
      trigger: 'What is Chrome built-in AI',
      content:
        'Chrome built-in AI refers to AI models, including large language models (LLMs) like Gemini Nano, that are integrated directly into the Chrome browser. This allows websites and web applications to perform AI-powered tasks without needing to deploy or manage their own AI models. Chrome Gemini Nano is a prime example of this technology, offering a free AI assistant in Chrome for various tasks.',
    },
    {
      id: 'What is Gemini Nano?',
      trigger: 'What is Gemini Nano?',
      content:
        'Gemini Nano is the most efficient version of the Gemini family of LLMs, designed to run locally on most modern desktop and laptop computers. It\'s also optimized for mobile devices, with the Gemini Nano Samsung S24 Ultra integration being a notable example of its capabilities in smartphones.',
    },
    {
      id: 'How does built-in AI compare to server-side AI solutions?',
      trigger: 'How does built-in AI compare to server-side AI solutions?',
      content:
        'While server-side AI is great for large models, built-in AI offers advantages in terms of privacy, speed, and offline capabilities. A hybrid approach, using both on-device AI (like Chrome Gemini Nano) and server-side AI, can be beneficial for many use cases. This is especially relevant for free AI assistants in Chrome that can leverage both local and cloud resources.',
    },
    {
      id: 'What are some use cases for built-in AI?',
      trigger: 'What are some use cases for built-in AI?',
      content:
        'Built-in AI, such as Chrome Gemini Nano, can be used for tasks like summarization, rephrasing, categorization, and other language-related use cases that benefit from on-device processing. The Gemini Nano Samsung S24 Ultra integration showcases how these capabilities can be extended to mobile devices for enhanced user experiences.',
    },
    {
      id: 'Where can I learn more about Chrome AI?',
      trigger: 'Where can I learn more about Chrome AI?',
      content:
        'To learn more about Chrome AI and free AI assistants in Chrome, you can read the official documentation at https://developer.chrome.com/docs/ai/built-in. For additional insights, check out this comprehensive document: https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit',
    },
  ];

  return (
    <div>
      <Accordion type="multiple" defaultValue={items.map((item) => item.id)}>
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.trigger}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
