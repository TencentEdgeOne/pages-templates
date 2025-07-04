import Image, { ImageProps, StaticImageData } from 'next/image';
import styles from '@/styles/try-on.module.scss';
import { renderTryOnVideo, TryOnTabVal } from './TryOnDemoLayout';
import { isIntl } from '@/utils/intl';
import { Zh, En } from './DialogContent';
import { Button, MessagePlugin, Loading, Dialog } from 'tdesign-react/lib';
import ArClient from '@/lib/arClient';
import { useEffect, useState } from 'react';
import effect0 from '@/public/image/effect0.png';
import handPng from '@/public/image/hand.png';
import { envConfig } from '@/lib/env';

interface Props {
  tabVal: TryOnTabVal;
  effectList: Effect[];
}

interface Effect {
  id: string;
  icon: string;
}

export function renderImage(
  image: StaticImageData,
  alt: string,
  style?: React.CSSProperties,
  props?: Partial<ImageProps>,
) {
  return (
    <div style={{ aspectRatio: `calc(${image.width / image.height})`, ...style }} className={styles.imageContainer}>
      <Image src={image.src} alt={alt} layout="fill" objectFit="contain" {...props} />
    </div>
  );
}

function TryOnDemo({ tabVal, effectList }: Props) {
  const isLens = tabVal === 'contact-lens';
  const isRings = tabVal === 'rings';
  const [isIniting, setIsIniting] = useState(false);
  const [isInited, setIsInited] = useState(false);
  const [_effectList] = useState<Effect[]>([{ id: '', icon: effect0.src }, ...effectList]);
  const [effectId, setEffectId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHandShow, setIsHandShow] = useState(false);
  const [isShowDialog, setIsShowDialog] = useState(false);

  const checkConfig = () => {
    return envConfig.appId && envConfig.licenseKey && envConfig.token;
  };

  const closeDialog = () => {
    setIsShowDialog(false);
  };

  const handleSetEffect = async (id: string) => {
    let client;
    if (isInited) {
      if (isLoading) return;
      client = ArClient.getInstance();
    } else {
      client = await initArClient();
    }
    if (client) {
      setEffectId(id);
      if (tabVal === 'animoji') {
        client.setAvatar(id);
      } else {
        client._setEffect(
          { id, intensity: isLens ? 0.6 : 1 },
          () => setIsLoading(true),
          () => setIsLoading(false),
        );
      }
    }
  };

  const initArClient = async () => {
    try {
      if (isIniting) return;
      setIsIniting(true);
      const client = ArClient.getInstance();
      if (!client) return;
      await client.init('stream', {
        arConfig: { mirror: true },
        beautifyConfig: { whiten: 0.3, dermabrasion: 0.3, lift: 0.2, shave: 0.2, chin: 0.2, usm: 0.3 },
        cameraConfig: { width: 344, height: 400, frameRate: 30 },
      });
      await client.initCore();
      await client.initLocalPlayer('try-on-output');
      await client.localPlay();
      setIsIniting(false);
      setIsInited(true);
      if (isRings) {
        setIsHandShow(true);
        setTimeout(() => setIsHandShow(false), 3000);
      }
      return client;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      setIsIniting(false);
      MessagePlugin.error({ content: 'Init ar client failed', offset: [0, 200] });
    }
  };

  const destroyArClient = () => {
    try {
      const client = ArClient.getInstance();
      client?.destroy();
    } catch (err: any) {
      console.log('Destroy ar client failed', err.name, err.message);
    }
  };

  const stopClient = async () => {
    try {
      const client = ArClient.getInstance();
      if (!client) return;
      client.localStop();
      await client.stop();
    } catch (err: any) {
      console.error('Stop ar client failed', err.name, err.message);
    }
  };

  const resumeClient = async () => {
    try {
      const client = ArClient.getInstance();
      if (!client) return;
      await client.restart();
      await client.localPlay();
    } catch (err: any) {
      MessagePlugin.error({ content: 'Resume ar client failed', offset: [0, 200] });
      console.error('Resume ar client failed', err.name, err.message);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      (document.hidden ? stopClient : resumeClient)();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      destroyArClient();

      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className={styles.tryOnDemo}>
      <Dialog
        header={isIntl() ? 'Missing Environment Variables' : '缺少环境变量'}
        theme="info"
        cancelBtn={false}
        visible={isShowDialog}
        onClose={closeDialog}
        onConfirm={closeDialog}
        confirmBtn={isIntl() ? 'OK' : '确定'}
        width={600}>
        {isIntl() ? <En /> : <Zh />}
      </Dialog>
      <div className={styles.demoShow}>
        {!isInited ? (
          <>
            {renderTryOnVideo(tabVal)}
            <Button
              className={styles.tryOnBtn}
              shape="round"
              theme="default"
              loading={isIniting}
              onClick={() => {
                if (!checkConfig()) {
                  setIsShowDialog(true);
                  return;
                }
                initArClient();
              }}>
              TRY ON
            </Button>
          </>
        ) : (
          <>{isRings && isHandShow && <div className={styles.handWrapper}>{renderImage(handPng, '')}</div>}</>
        )}
        <div id="try-on-output" style={{ height: '100%' }}></div>
        <Loading attach={`.${styles.demoShow}`} loading={isLoading} showOverlay={false} />
      </div>
      <div className={styles.demoSelects}>
        {_effectList.map((item) => (
          <div
            className={`${styles.demoItem} 
          ${!item.id ? styles.noneItem : ''}
          ${effectId === item.id ? styles.demoItemSelect : ''} 
          ${isLens && item.id ? styles.lenDemoItem : ''}
          ${isRings && item.id ? styles.ringDemoItem : ''}
          `}
            key={`effect-${item.id}`}
            style={{ backgroundImage: `url(${item.icon})` }}
            onClick={() => {
              if (!checkConfig()) {
                setIsShowDialog(true);
                return;
              }
              handleSetEffect(item.id);
            }}></div>
        ))}
      </div>
    </div>
  );
}

export default TryOnDemo;
