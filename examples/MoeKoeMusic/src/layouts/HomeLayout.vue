<template>
    <Header />
    <main>
        <div v-if="!isOnline" class="network-status">
            网络连接已断开
        </div>
        <router-view :playerControl="playerControl"></router-view>
    </main>
    <PlayerControl ref="playerControl" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Header from "@/components/Header.vue";
import PlayerControl from "@/components/PlayerControl.vue";
import { setTheme, applyColorTheme } from '../utils/utils';
const playerControl = ref(null);
const isOnline = ref(navigator.onLine);

// 监听网络状态变化
const handleNetworkChange = (online) => {
    isOnline.value = online;
    
    const title = online ? '网络已连接' : '网络已断开';
    const body = online ? '您已恢复网络连接' : '请检查网络设置';
    
    new Notification(title, {
        body,
        icon: './assets/images/logo.png'
    });
};

onMounted(() => {
    const savedConfig = JSON.parse(localStorage.getItem('settings'));
    if (savedConfig) {
        applyColorTheme(savedConfig['themeColor']);
    }
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }

    // 添加网络状态监听
    window.addEventListener('online', () => handleNetworkChange(true));
    window.addEventListener('offline', () => handleNetworkChange(false));
    
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
});

// 组件卸载时移除事件监听
onUnmounted(() => {
    window.removeEventListener('online', () => handleNetworkChange(true));
    window.removeEventListener('offline', () => handleNetworkChange(false));
});
</script>

<style>
:root {
    /* 粉红色主色调 */
    --primary-color: #FF69B4;
    /* 浅粉红色辅助色 */
    --secondary-color: #FFB6C1;
    --text-color: #333;
    /* 浅粉色背景 */
    --background-color: #FFF0F5;
    /* 高亮色 */
    --color-primary: #ea33e4;
    --color-secondary-bg-for-transparent: rgba(209, 209, 214, 0.28);
    --color-box-shadow: rgba(255, 105, 180, 0.2);
}

* {
    user-select: none;
}

body,
html {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #FFF;
    color: var(--text-color);
    height: 100%;
}

body {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

::-webkit-scrollbar {
    width: 0;
    height: 0;
}

main {
    min-height: calc(100vh - 80px - 188px);
    max-width: 1200px;
    margin: 0 auto;
    margin-bottom: 150px;
    padding-top: 80px;
    padding-bottom: 150px;
}

a {
    text-decoration: none;
    color: inherit;
    display: block;
}

.network-status {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background-color: #ff4757;
    color: white;
    text-align: center;
    padding: 8px;
    z-index: 1000;
}
</style>