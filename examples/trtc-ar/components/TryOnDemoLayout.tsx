'use client';
import React from 'react';
import { Tabs } from 'tdesign-react/lib';
import 'tdesign-react/dist/tdesign.css';
import styles from '@/styles/try-on.module.scss';
import AccordionWebm1 from '@/public/video/accordionVideo_new1.webm';
import AccordionWebm2 from '@/public/video/accordionVideo_new2.webm';
import AccordionWebm3 from '@/public/video/accordionVideo_new3.webm';
import AccordionWebm4 from '@/public/video/accordionVideo_new4.webm';
import AccordionWebm5 from '@/public/video/accordionVideo_new5.webm';
import AccordionWebm6 from '@/public/video/accordionVideo_new6.webm';
import AccordionWebm7 from '@/public/video/accordionVideo_new7.webm';
import AccordionVideo1 from '@/public/video/accordionVideo_new1.mp4';
import AccordionVideo2 from '@/public/video/accordionVideo_new2.mp4';
import AccordionVideo3 from '@/public/video/accordionVideo_new3.mp4';
import AccordionVideo4 from '@/public/video/accordionVideo_new4.mp4';
import AccordionVideo5 from '@/public/video/accordionVideo_new5.mp4';
import AccordionVideo6 from '@/public/video/accordionVideo_new6.mp4';
import AccordionVideo7 from '@/public/video/accordionVideo_new7.mp4';
import ring1 from '@/public/image/ring1.png';
import ring2 from '@/public/image/ring2.png';
import ring3 from '@/public/image/ring3.png';
import ring4 from '@/public/image/ring4.png';
import ring5 from '@/public/image/ring5.png';
import len1 from '@/public/image/len1.png';
import len2 from '@/public/image/len2.png';
import len3 from '@/public/image/len3.png';
import len4 from '@/public/image/len4.png';
import len5 from '@/public/image/len5.png';
import dynamic from 'next/dynamic';
const { TabPanel } = Tabs;
const VideoMap_webm = {
  makeup: AccordionWebm1,
  glasses: AccordionWebm2,
  'contact-lens': AccordionWebm3,
  headwear: AccordionWebm4,
  rings: AccordionWebm5,
  'face-sticker': AccordionWebm6,
  animoji: AccordionWebm7,
};

const VideoMap_mp4 = {
  makeup: AccordionVideo1,
  glasses: AccordionVideo2,
  'contact-lens': AccordionVideo3,
  headwear: AccordionVideo4,
  rings: AccordionVideo5,
  'face-sticker': AccordionVideo6,
  animoji: AccordionVideo7,
};
interface Effect {
  id: string;
  icon: string;
}
const effectList_makeup: Effect[] = [
  {
    id: '3EB3317E53997405',
    icon: 'https://webar-static.tencent-cloud.com/preset-effect/1648883499668/preview.png',
  },
  {
    id: '9C7E317E53997405',
    icon: 'https://webar-static.tencent-cloud.com/preset-effect/1648883456268/preview.png',
  },
  {
    id: '498A117E53997405',
    icon: 'https://webar-static.tencent-cloud.com/preset-effect/1648883581370/preview.png',
  },
  {
    id: '7AC1617E53997405',
    icon: 'https://webar-static.tencent-cloud.com/preset-effect/1648883644315/preview.png',
  },
  {
    id: '503FD17E53997405',
    icon: 'https://webar-static.tencent-cloud.com/preset-effect/1648733929230/preview.png',
  },
];

const effectList_glasses: Effect[] = [
  {
    id: '9631A190BF72BEB2',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1720167334580/preview.png',
  },
  {
    id: 'F175D19127124D1A',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1722933240621/preview.png',
  },
  {
    id: '4CB4F18377D8DA92',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1661504847470/preview.png',
  },
  {
    id: '19941195D6FBD73C',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1743068311563/preview.png',
  },
  {
    id: '3ED08195D6FB50D0',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1743067949997/preview.png',
  },
  {
    id: 'A318818377D51CE8',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1661516103083/preview.png',
  },
  {
    id: 'CA1AC195D6F96DA6',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1743067616528/preview.png',
  },
];

const effectList_lens: Effect[] = [
  {
    id: 'BFC66190DD8DF567',
    icon: len1.src,
  },
  {
    id: '6F21917E53997405',
    icon: len2.src,
  },
  {
    id: 'A46B817E53997405',
    icon: len3.src,
  },
  {
    id: 'E6C0617E53997405',
    icon: len4.src,
  },
  {
    id: 'D994317E53997405',
    icon: len5.src,
  },
];

const effectList_headwear: Effect[] = [
  {
    id: '153B1195EAFC6DF3',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1733826062269/preview.png',
  },
  {
    id: 'B452E195EAFB6867',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1733826457274/preview.png',
  },
  {
    id: '6F32E195D6CC5304',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1722935755073/preview.png',
  },
  {
    id: '6E47B195D6C9231D',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1722417082281/preview.png',
  },
  {
    id: 'D64AF191124A4C74',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1722411341812/preview.png',
  },
  {
    id: '3A66518377D61548',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1661515887219/preview.png',
  },
  {
    id: '9358218377D77A03',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/thumb/bangqiumao3.png',
  },
];

const effectList_rings: Effect[] = [
  {
    id: '26CB2190E4824600',
    icon: ring1.src,
  },
  {
    id: 'B6C24190E4845CD6',
    icon: ring2.src,
  },
  {
    id: '26720195EB8BE252',
    icon: ring3.src,
  },
  {
    id: '6077E195F03A9E22',
    icon: ring4.src,
  },
  {
    id: '94574195FAE20A3D',
    icon: ring5.src,
  },
  // {
  //   id: 'A6E30195CCA644E2',
  //   icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1742895133745/preview.png'
  // },
  // {
  //   id: '4226C195F095332B',
  //   icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1743498024422/preview.png'
  // },
];

const effectList_sticker: Effect[] = [
  {
    id: '8A9BC195EF3BC567',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1649238483046/preview.png',
  },
  {
    id: 'B4D63180653948C3',
    icon: 'https://webar-static.tencent-cloud.com/preset-effect/1650965686973/preview.png',
  },
  {
    id: 'EDE5D18065451445',
    icon: 'https://webar-static.tencent-cloud.com/preset-effect/1651042561811/preview.png',
  },
  {
    id: '8D385195EF40F9D3',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/thumb/bdd.png',
  },
  {
    id: '10165195EF3F9DD7',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1648519185645/preview.png',
  },
  {
    id: '3E3E118377D35D01',
    icon: 'https://webar-static.tencent-cloud.com/custom-effect/1309122168/1661516724668/preview.png',
  },
  {
    id: '7A62218064EF7959',
    icon: 'https://webar-static.tencent-cloud.com/preset-effect/1650968644574/preview.png',
  },
];

const effectList_animoji: Effect[] = [
  {
    id: 'D0C9A182E874D899',
    icon: 'https://webar-static.tencent-cloud.com/preset-effect/1661860946984/preview-new.png',
  },
  {
    id: '4A9FD182C9879EDA',
    icon: 'https://webar-static.tencent-cloud.com/preset-effect/1661861326426/preview-new.png',
  },
  {
    id: 'A80B6183C695B4EA',
    icon: 'https://webar-static.tencent-cloud.com/preset-effect/1665650871872/preview-new.png',
  },
  {
    id: 'E8064182C98E69EE',
    icon: 'https://webar-static.tencent-cloud.com/preset-effect/1665650922385/preview-new.png',
  },
];

const effectMap: { [key in TryOnTabVal]: Effect[] } = {
  makeup: effectList_makeup,
  glasses: effectList_glasses,
  'contact-lens': effectList_lens,
  headwear: effectList_headwear,
  rings: effectList_rings,
  'face-sticker': effectList_sticker,
  animoji: effectList_animoji,
};

export type TryOnTabVal = 'makeup' | 'glasses' | 'contact-lens' | 'headwear' | 'rings' | 'face-sticker' | 'animoji';
export const renderTryOnVideo = (scene: TryOnTabVal) => {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      height="100%"
      style={{ objectFit: 'cover', aspectRatio: '0.86' }}>
      <source src={VideoMap_webm[scene]} type="video/webm" />
      <source src={VideoMap_mp4[scene]} type="video/mp4" />
    </video>
  );
};
export default function TryOnDemoLayout() {
  const tabs: { label: string; value: TryOnTabVal }[] = [
    { label: 'Makeup', value: 'makeup' },
    { label: 'Glasses', value: 'glasses' },
    { label: 'Contact Lenses', value: 'contact-lens' },
    { label: 'Headwear', value: 'headwear' },
    { label: 'Rings', value: 'rings' },
  ];

  const TryOnDemo = dynamic(() => import('./TryOnDemo'), {
    loading: ({ isLoading }) => (isLoading ? <div className={styles.demoLoadWrapper}></div> : null),
    ssr: false,
  });

  return (
    <div>
      <div className={styles.layout}>
        <Tabs placement="top" size="medium" defaultValue="makeup" className={styles.tabStyle}>
          {tabs.map((item, index) => (
            <TabPanel key={`tabPanel${index}`} value={item.value} label={item.label}>
              <TryOnDemo tabVal={item.value as TryOnTabVal} effectList={effectMap[item.value]} />
            </TabPanel>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
