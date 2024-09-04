import React, {
  useState,
  FormEvent,
  ChangeEvent,
  useRef,
  useEffect,
} from 'react';

interface OutputItem {
  input: string;
  output: string;
}

interface Props {
  title: string;
  code: string;
}

export default function CodeBox(props: Props) {
  const { title, code } = props;

  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<OutputItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setInput(code);
  }, [code]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOutput([]);
    setLoading(true);
    try {
      const asyncEval = async (code: string): Promise<any> => {
        const func = new Function('return (async () => { ' + code + ' })()');
        return await func();
      };
      const result = await asyncEval(input);
      setOutput([{ input, output: result }]);
    } catch (error) {
      if (error instanceof Error) {
        setOutput([{ input, output: error.toString() }]);
      } else {
        setOutput([{ input, output: 'Unknown error' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 text-white bg-gray-900 rounded-lg">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <form onSubmit={handleSubmit} className="flex mb-4">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setInput(e.target.value)
          }
          className="w-full p-2 mr-2 text-white bg-gray-800 rounded"
          placeholder="Enter your code here..."
          rows={1}
          style={{ resize: 'none', overflow: 'hidden' }}
        />
        <button
          type="submit"
          className={`w-28 p-2 text-white rounded transition-all duration-300 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Loading...' : 'Execute'}
        </button>
      </form>
      <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
        {output.map((item, index) => (
          <div key={index} className="mb-2">
            <div className="text-gray-500">{`> ${item.input}`}</div>
            <div>{item.output}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
