import { ref } from 'vue';

export default function useAudioController({ onSongEnd, updateCurrentTime }) {
    const audio = new Audio();
    const playing = ref(false);
    const isMuted = ref(false);
    const volume = ref(66);
    const playbackRate = ref(1.0);

    // 初始化音频设置
    const initAudio = () => {
        const savedVolume = localStorage.getItem('player_volume');
        if (savedVolume !== null) volume.value = parseFloat(savedVolume);
        isMuted.value = volume.value === 0;
        audio.volume = volume.value / 100;
        audio.muted = isMuted.value;

        // 初始化播放速度
        const savedSpeed = localStorage.getItem('player_speed');
        if (savedSpeed !== null) {
            playbackRate.value = parseFloat(savedSpeed);
            audio.playbackRate = playbackRate.value;
        }

        audio.addEventListener('ended', onSongEnd);
        audio.addEventListener('pause', handleAudioEvent);
        audio.addEventListener('play', handleAudioEvent);
        audio.addEventListener('timeupdate', updateCurrentTime);

        console.log('[AudioController] 初始化完成，音量设置为:', audio.volume, 'volume值:', volume.value, '播放速度:', audio.playbackRate);
    };

    // 处理播放/暂停事件
    const handleAudioEvent = (event) => {
        playing.value = event.type === 'play';
        console.log(`[AudioController] ${event.type}事件: playing=${playing.value}`);
        if (typeof window !== 'undefined' && typeof window.electron !== 'undefined') {
            window.electron.ipcRenderer.send('play-pause-action', playing.value, audio.currentTime);
        }
    };

    // 切换播放/暂停
    const togglePlayPause = async () => {
        console.log(`[AudioController] 切换播放状态: playing=${playing.value}, src=${audio.src}`);
        if (playing.value) {
            audio.pause();
            playing.value = false;
        } else {
            try {
                await audio.play();
                playing.value = true;
            } catch (error) {
                console.error('[AudioController] 播放失败:', error);
                return false;
            }
        }
        return true;
    };

    // 切换静音
    const toggleMute = () => {
        isMuted.value = !isMuted.value;
        audio.muted = isMuted.value;
        console.log(`[AudioController] 切换静音: muted=${isMuted.value}`);
        if (isMuted.value) {
            volume.value = 0;
        } else {
            volume.value = audio.volume * 100;
        }
        localStorage.setItem('player_volume', volume.value);
    };

    // 修改音量
    const changeVolume = () => {
        audio.volume = volume.value / 100;
        localStorage.setItem('player_volume', volume.value);
        isMuted.value = volume.value === 0;
        audio.muted = isMuted.value;
        console.log(`[AudioController] 修改音量: volume=${volume.value}, audio.volume=${audio.volume}, muted=${isMuted.value}`);
    };

    // 设置进度
    const setCurrentTime = (time) => {
        audio.currentTime = time;
        console.log(`[AudioController] 设置进度: time=${time}`);
    };

    // 设置播放速度
    const setPlaybackRate = (speed) => {
        playbackRate.value = speed;
        audio.playbackRate = speed;
        localStorage.setItem('player_speed', speed);
        console.log('[AudioController] 设置播放速度:', speed);
    };

    // 销毁时清理
    const destroy = () => {
        console.log('[AudioController] 销毁音频控制器');
        audio.removeEventListener('ended', onSongEnd);
        audio.removeEventListener('pause', handleAudioEvent);
        audio.removeEventListener('play', handleAudioEvent);
        audio.removeEventListener('timeupdate', updateCurrentTime);
    };

    return {
        audio,
        playing,
        isMuted,
        volume,
        playbackRate,
        initAudio,
        togglePlayPause,
        toggleMute,
        changeVolume,
        setCurrentTime,
        setPlaybackRate,
        destroy
    };
} 