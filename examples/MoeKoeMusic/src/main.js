import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router/router';
import { formatMilliseconds, getCover, applyColorTheme, setTheme, getQuality } from '../src/utils/utils';
import ModalPlugin from './plugins/ModalPlugin';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import i18n from './utils/i18n';
import '@/assets/themes/dark.css';
import { registerSW } from 'virtual:pwa-register'

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersistedstate);
app.config.globalProperties.$getCover = getCover;
app.config.globalProperties.$getQuality = getQuality;
app.config.globalProperties.$formatMilliseconds = formatMilliseconds;
app.config.globalProperties.$applyColorTheme = applyColorTheme;
app.config.globalProperties.$setTheme = setTheme;
// 配置全局错误处理器
app.config.errorHandler = (err, vm, info) => {
  console.error(`全局捕获异常: ${info}`, err);
};
// 配置全局警告处理器
app.config.warnHandler = (msg, vm, trace) => {
  console.warn(`全局捕获警告: ${msg}`, trace);
};
// 捕获未处理的 Promise 拒绝
window.addEventListener('unhandledrejection', event => {
  console.error('未处理的 Promise 拒绝:', event.reason);
  // window.$modal.alert('系统错误');
});

if (!window.electron) {
  registerSW({
    onNeedRefresh() {
      console.log('有新内容可用，请刷新页面')
    },
    onOfflineReady() {
      console.log('应用已准备好离线工作')
    }
  })
}

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(ModalPlugin);
app.use(ElementPlus);

app.mount('#app');