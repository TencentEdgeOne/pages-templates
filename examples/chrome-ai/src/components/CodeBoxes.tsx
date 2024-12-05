import CodeBox from './CodeBox';

export default function CodeBoxes() {
  const codes = [
    {
      title: 'Startup',
      code: `
const model = await window.ai.languageModel.create();
const res = await model.prompt("Who are you?");
return res;
      `,
    },
    {
      title: 'Translate',
      code: `
const model = await window.ai.languageModel.create();
const res = await model.prompt("Translate this sentence into French:'hello?'");
return res;
      `,
    },
  ];

  return (
    <div>
      {codes.map((code) => (
        <div key={code.title} className="mb-4">
          <CodeBox title={code.title} code={code.code} />
        </div>
      ))}
    </div>
  );
}
