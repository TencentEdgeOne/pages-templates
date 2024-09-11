import Faq from '@/components/common/Faq';
import MarkmapEditor from './MarkmapEditor';

export default function Home() {
  return (
    <main>
      <h1 className="px-4 py-2 my-2 text-4xl font-bold text-center text-blue-600 rounded-lg shadow-md bg-gradient-to-r from-blue-100 to-blue-200">
        Growth Path of AWS Technology for Web Developers
      </h1>
      <MarkmapEditor />
      <Faq />
    </main>
  );
}
