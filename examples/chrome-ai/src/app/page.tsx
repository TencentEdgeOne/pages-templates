import CompatibilityWrapper from '@/components/CompatibilityWrapper';
import Header from '@/components/Header';
import Faq from '@/components/Faq';

export default function Home() {
  return (
    <div className="flex flex-col w-full max-w-4xl p-4 mx-auto space-y-6 md:p-8">
      <div className="flex flex-col flex-1 w-full h-full">
        <div className="mx-auto h-full flex-1 px-4 py-4 border-border w-full rounded-lg border backdrop-blur-[2px] md:p-6">
          <div className="flex flex-col w-full gap-8 mx-auto">
            <Header />
            <CompatibilityWrapper />
            <Faq />
          </div>
        </div>
      </div>
    </div>
  );
}
