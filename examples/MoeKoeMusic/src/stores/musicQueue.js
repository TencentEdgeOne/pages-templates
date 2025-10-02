import { defineStore } from 'pinia';

export const useMusicQueueStore = defineStore('MusicQueue', {
    state: () => ({
        queue: [], // 播放列表
    }),
    actions: {
        // 添加歌曲到播放队列
        addSong(song) {
            this.queue.push(song);
        },
        // 设置整个队列
        setQueue(newQueue) {
            this.queue = newQueue;
        },
        // 获取播放队列
        getQueue() {
            return this.queue;
        },
        // 清空指定歌曲
        removeSong(index) {
            this.queue.splice(index, 1);
        },
        // 清空播放队列
        clearQueue() {
            this.queue = [];
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'MusicQueue',
                storage: localStorage,
                paths: ['queue'],
            },
        ],
    },
});