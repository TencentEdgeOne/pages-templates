import Statement from '@/components/common/Statement';
import MarkmapEditor from './MarkmapEditor';

export default function Home() {
  return (
    <main>
      <h1 className="px-4 py-2 text-4xl font-bold text-center text-blue-600 shadow-md bg-gradient-to-r from-blue-100 to-blue-200">
        Free Developer Resources Mind Map | Tools, Services & Platforms
      </h1>
      <MarkmapEditor />
      <Statement />
    </main>
  );
}
