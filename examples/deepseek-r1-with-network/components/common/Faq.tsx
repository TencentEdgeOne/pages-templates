import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Faq() {
  const items = [
    {
      trigger: 'Where is this website hosted?',
      content: (
        <>
          This webpage is hosted on{' '}
          <a
            href="https://edgeone.ai/pages/templates"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Edgeone Pages
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
        </>
      ),
    },
  ].map((item) => ({ ...item, id: item.trigger }));

  return (
    <div className="p-4">
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
