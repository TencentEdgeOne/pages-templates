import { Base } from '@/components/Base';
import { getStaticDirectoryData } from '@/lib/static-data';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Fetch data at build time
  const { directoryItems, allTags } = await getStaticDirectoryData();
  
  return (
    <main>
      <Base 
        initialDirectoryItems={directoryItems}
        initialTags={allTags}
      />
    </main>
  );
}
