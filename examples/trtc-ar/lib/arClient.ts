import { ArSdk } from 'tencentcloud-webar';
import { authConfig } from '@/lib/env';
import { getStorage, setStorage } from '@/utils/storage';
import { isIntl } from '@/utils/intl';

export interface EffectParam {
  id: string;
  intensity?: number;
}

const videoConfig = { width: 640, height: 480, frameRate: 30 };
export default class ArClient {
  static instance: ArClient | null = null;

  hasInit = false;
  hasCreate = false;
  hasReady = false;
  hasCameraReady = false;
  filterList: any[] = [];
  makeupList: any[] = [];
  stickerList: any[] = [];

  private arSdk: typeof ArSdk;
  private localPlayer: any = null;
  private initType: 'camera' | 'stream' = 'camera';
  private videoId = '';
  private videoDeviceId = '';
  private cameraConfig = videoConfig;
  private stream: MediaStream | null = null;
  private effectMap: { [key: string]: EffectParam } = { filter: { id: '' }, makeup: { id: '' }, sticker: { id: '' } };
  private effectSet: Set<string> = new Set();

  static getInstance(): ArClient | null {
    if (!this.instance) {
      this.instance = new ArClient();
    }

    return this.instance;
  }

  static destroyInstance() {
    if (!this.instance) return;
    this.instance = null;
  }

  async init(
    type: 'camera' | 'stream',
    {
      arConfig,
      beautifyConfig,
      cameraConfig = videoConfig,
    }: {
      arConfig?: any;
      beautifyConfig?: any;
      cameraConfig?: any;
    },
  ) {
    const config: any = {
      auth: authConfig,
      module: { beautify: true, segmentation: false, handLandmark: true },
      language: 'en',
      lazyInit: true,
      resolution: 'auto',
      ...arConfig,
    };

    if (type === 'camera') {
      config.camera = cameraConfig;
    }

    if (type === 'stream') {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: cameraConfig });
      this.stream = stream;
      config.input = stream;
    }

    if (beautifyConfig) {
      config.beautify = beautifyConfig;
    }

    const arSdk = new ArSdk(config);
    this.initType = type;
    this.arSdk = arSdk;
    this.bindEvent();
    this.hasInit = true;
    this.cameraConfig = cameraConfig;
  }

  destroy() {
    this.localDestroy();
    this.localPlayer = null;
    this.arSdk.stop();
    this.arSdk.destroy();
    this.arSdk = null;
    this.videoId = '';
    this.stream = null;
    this.effectMap = {};
    this.effectSet.clear();
    this.hasInit = false;
    this.hasCreate = false;
    this.hasReady = false;
    this.hasCameraReady = false;
  }

  bindEvent() {
    this.arSdk.on('created', async () => {
      try {
        const filterRes: Promise<any[]> = new Promise((resolve) => {
          const list = getStorage('common-filter-list');
          if (list) return resolve(list);
          return resolve(this.arSdk.getCommonFilter());
        });
        const effectRes: Promise<any[]> = new Promise((resolve) => {
          const list = getStorage('common-effect-list');
          if (list) return resolve(list);
          return resolve(this.arSdk.getEffectList({ Type: 'Preset' }));
        });
        const res = await Promise.all([filterRes, effectRes]);
        setStorage('common-filter-list', res[0]);
        setStorage('common-effect-list', res[1]);
        this.filterList = [
          { Id: 'none', EffectId: '', Name: 'None' },
          ...res[0].sort((a: any, b: any) => b.Weight - a.Weight),
        ];
        this.makeupList = [
          { Id: 'none', EffectId: '', Name: 'None' },
          ...res[1].filter((item: any) => item.Label.includes('Makeup')).sort((a: any, b: any) => b.Weight - a.Weight),
        ];
        this.stickerList = [
          { Id: 'none', EffectId: '', Name: 'None' },
          ...res[1]
            .filter((item: any) => item.Label.includes('Sticker') && !item.Label.includes('3D Effect'))
            .sort((a: any, b: any) => b.Weight - a.Weight),
        ];
      } catch (err) {
        console.error('Get filter list and effect list failed', err);
      }

      this.hasCreate = true;
    });
    this.arSdk.on('ready', () => {
      this.hasReady = true;
    });
    this.arSdk.on('cameraReady', () => {
      this.hasCameraReady = true;
    });
    this.arSdk.on('error', (err: any) => {
      console.error('ArSdk error', err);
      alert(
        isIntl()
          ? 'The domain bound to the Web Beauty Lisence is inconsistent with the current domain. Check whether the preview address is currently accessed from the deployment record. Please switch to the project preview address for preview.'
          : 'Web 美颜特效 Lisence 绑定的域名与当前域名不一致，检查当前是否是从部署记录访问预览地址，请切换到项目预览地址进行预览。',
      );
    });
  }

  async getOutput(fps?: number): Promise<MediaStream | void> {
    if (!this.arSdk) return;
    const arStream = this.arSdk.getOutput(fps);
    return arStream;
  }

  async initCore(): Promise<void> {
    if (!this.arSdk) return;
    const promise = this.arSdk.initCore();
    return promise;
  }

  async initLocalPlayer(elementId: string): Promise<void> {
    if (!this.arSdk) return;
    this.videoId = elementId;
    this.localPlayer = await this.arSdk.initLocalPlayer(elementId);
    return;
  }

  async localPlay(): Promise<void> {
    if (!this.localPlayer) return;
    if (!this.localPlayer.playerView) await this.initLocalPlayer(this.videoId);
    const promise = await this.localPlayer.play();
    return promise;
  }

  localStop() {
    if (!this.localPlayer) return;
    this.localPlayer.stop();
  }

  localDestroy() {
    if (!this.localPlayer) return;
    this.localPlayer.destroy();
  }

  async stopVideo(): Promise<void> {
    if (!this.arSdk) return;

    if (this.initType === 'camera') {
      return this.arSdk.camera?.stopVideo();
    }

    const stream = await this.getOutput(15);
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => t.stop());
    return;
  }

  async restartVideo(): Promise<void> {
    if (!this.arSdk) return;

    if (this.initType === 'camera') {
      return this.arSdk.camera?.restartVideo();
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { ...videoConfig, deviceId: this.videoDeviceId },
    });
    return this.arSdk.updateInputStream(stream);
  }

  async stop(): Promise<void> {
    if (!this.arSdk) return;

    if (this.initType === 'camera') {
      return this.arSdk.camera?.stopVideo();
    }

    if (!this.stream) return;
    this.stream.getTracks().forEach((t) => t.stop());
    return;
  }

  async restart(): Promise<void> {
    if (!this.arSdk) return;

    if (this.initType === 'camera') {
      return this.arSdk.camera?.restartVideo();
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { ...this.cameraConfig, deviceId: this.videoDeviceId },
    });
    this.stream = stream;
    return this.arSdk.updateInputStream(stream);
  }

  async switchDevice(type: 'audio' | 'video', id: string): Promise<void> {
    if (!this.hasCameraReady) return;

    if (this.initType === 'camera') {
      return this.arSdk.camera?.switchDevice(type, id);
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { ...videoConfig, deviceId: id } });
    this.videoDeviceId = id;
    return this.arSdk.updateInputStream(stream);
  }

  setBeautify(params: { [key: string]: number }) {
    if (!this.arSdk) return;
    this.arSdk.setBeautify(params);
  }

  setEffect(paramsArray: { label: string; value: EffectParam }[], before?: () => void, after?: () => void) {
    if (!this.arSdk) return;
    let hasIdChange = false;
    paramsArray.forEach((p) => {
      if (!this.effectMap[p.label] || this.effectMap[p.label].id !== p.value.id) hasIdChange = true;
      this.effectMap[p.label] = p.value;
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    hasIdChange && before?.();
    this.arSdk.setEffect(
      Object.values(this.effectMap).filter((e) => !!e.id),
      hasIdChange ? after : () => {},
    );
  }

  _setEffect(effect: EffectParam, before?: () => void, after?: () => void) {
    if (!this.arSdk) return;
    const effectId = effect.id;
    if (effectId) {
      if (!this.effectSet.has(effectId)) {
        before?.();
        this.effectSet.add(effectId);
      }
      this.arSdk.setEffect([effect], after);
    } else this.arSdk.setEffect(null);
  }

  setAvatar(effectId: string) {
    if (!this.arSdk) return;
    if (effectId) {
      this.arSdk.setAvatar({
        mode: 'AR',
        effectId,
      });
    } else this.arSdk.setAvatar(null);
  }
}
