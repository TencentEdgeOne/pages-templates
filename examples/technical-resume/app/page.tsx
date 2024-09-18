import Resume from './components/Resume';
import resumeData from './data/resumeData.json';
import FAQ from './components/Faq';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <Resume data={resumeData} />
      <FAQ />
    </main>
  );
}