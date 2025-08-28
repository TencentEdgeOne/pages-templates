import { app, dialog } from 'electron';
import electronUpdater from 'electron-updater';
const { autoUpdater } = electronUpdater;
import Store from 'electron-store';

const store = new Store();
autoUpdater.autoDownload = false; // 自动下载更新
autoUpdater.autoInstallOnAppQuit = false; // 自动安装更新
// 开发环境模拟打包状态
Object.defineProperty(app, 'isPackaged', {
    get() {
        return true;
    }
});
// 设置更新服务器地址
export function setupAutoUpdater(mainWindow) {
    autoUpdater.setFeedURL({
        provider: 'github',
        owner: 'iAJue',
        repo: 'MoeKoeMusic',
        releaseType: 'release'
    });
    
    autoUpdater.channel = 'latest';
    
    // 检查更新错误
    autoUpdater.on('error', (error) => {
        console.error('更新检查失败:', error.message);
        dialog.showMessageBox({
        type: 'error',
        message: error.message.includes('ETIMEDOUT') 
            ? '更新服务器连接超时，请检查网络' 
            : '更新检查失败，请重试'
        });
    });

    // 检查到新版本
    autoUpdater.on('update-available', (info) => {
        dialog.showMessageBox({
            type: 'info',
            title: '发现新版本',
            message: `发现新版本 ${info.version}\n\n${info.releaseNotes?.replace(/<[^>]*>/g, '') || '暂无更新说明'}`,
            buttons: ['立即更新', '稍后提醒'],
            cancelId: 1
        }).then(result => {
            if (result.response === 0) {
                autoUpdater.downloadUpdate();
            }
        });
    });

    // 当前已是最新版本
    autoUpdater.on('update-not-available', () => {
        const settings = store.get('settings') || {};
        if (!settings.silentCheck) {
            dialog.showMessageBox({
                type: 'info',
                title: '更新提示',
                message: '当前已是最新版本',
                buttons: ['确定']
            });
        }
    });

    // 更新下载进度
    autoUpdater.on('download-progress', (progressObj) => {
        mainWindow.setProgressBar(progressObj.percent / 100);
        mainWindow.webContents.send('update-progress', progressObj);
    });

    // 更新下载完成
    autoUpdater.on('update-downloaded', () => {
        mainWindow.setProgressBar(-1);
        dialog.showMessageBox({
            type: 'info',
            title: '更新就绪',
            message: '新版本已下载完成，立即安装？',
            buttons: ['现在安装', '稍后安装'],
            cancelId: 1
        }).then(result => {
            if (result.response === 0) {
                autoUpdater.quitAndInstall(false, true);
            }
        });
    });
}

// 检查更新
export function checkForUpdates(silent = false) {
    const settings = store.get('settings') || {};
    if (silent) {
        settings.silentCheck = true;
        store.set('settings', settings);
    } else {
        settings.silentCheck = false;
        store.set('settings', settings);
    }

    autoUpdater.checkForUpdates().catch(error => {
        console.error('检查更新出错:', error);
    });
}