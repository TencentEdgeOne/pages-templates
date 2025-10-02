<template>
    <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
            <h2>{{ $t('yong-hu-tiao-kuan') }}</h2>
            <p>{{ $t('1-ben-cheng-xu-shi-ku-gou-di-san-fang-ke-hu-duan-bing-fei-ku-gou-guan-fang-xu-yao-geng-wan-shan-de-gong-neng-qing-xia-zai-guan-fang-ke-hu-duan-ti-yan') }}</p>
            <p>{{ $t('2-ben-xiang-mu-jin-gong-xue-xi-jiao-liu-shi-yong-nin-zai-shi-yong-guo-cheng-zhong-ying-zun-zhong-ban-quan-bu-de-yong-yu-shang-ye-huo-fei-fa-yong-tu') }}</p>
            <p>{{ $t('3-zai-shi-yong-ben-xiang-mu-de-guo-cheng-zhong-ke-neng-hui-sheng-cheng-ban-quan-nei-rong-ben-xiang-mu-bu-yong-you-zhe-xie-ban-quan-nei-rong-de-suo-you-quan-wei-le-bi-mian-qin-quan-hang-wei-nin-xu-zai-24-xiao-shi-nei-qing-chu-you-ben-xiang-mu-chan-sheng-de-ban-quan-nei-rong') }}</p>
            <p>{{ $t('4-ben-xiang-mu-de-kai-fa-zhe-bu-dui-yin-shi-yong-huo-wu-fa-shi-yong-ben-xiang-mu-suo-dao-zhi-de-ren-he-sun-hai-cheng-dan-ze-ren-bao-kuo-dan-bu-xian-yu-shu-ju-diu-shi-ting-gong-ji-suan-ji-gu-zhang-huo-qi-ta-jing-ji-sun-shi') }}</p>
            <p>{{ $t('5-nin-bu-de-zai-wei-fan-dang-di-fa-lv-fa-gui-de-qing-kuang-xia-shi-yong-ben-xiang-mu-yin-wei-fan-fa-lv-fa-gui-suo-dao-zhi-de-ren-he-fa-lv-hou-guo-you-yong-hu-cheng-dan') }}</p>
            <p>{{ $t('6-ben-xiang-mu-jin-yong-yu-ji-shu-tan-suo-he-yan-jiu-bu-jie-shou-ren-he-shang-ye-he-zuo-guang-gao-huo-juan-zeng-ru-guo-guan-fang-yin-le-ping-tai-dui-ci-xiang-mu-cun-you-yi-lv-ke-sui-shi-lian-xi-kai-fa-zhe-yi-chu-xiang-guan-nei-rong') }}</p>
            <p>{{ $t('tong-yi-ji-xu-shi-yong-ben-xiang-mu-nin-ji-jie-shou-yi-shang-tiao-kuan-sheng-ming-nei-rong') }}</p>
            <div class="button-group">
                <button @click="agree">{{ $t('tong-yi') }}</button>
                <button @click="disagree">{{ $t('bu-tong-yi') }}</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const showModal = ref(false);

onMounted(() => {
    if(isElectron()){
        window.electron.ipcRenderer.on('show-disclaimer', () => {
            showModal.value = true;
        });
        return
    }
    if(!localStorage.getItem('disclaimerAccepted')){
        showModal.value = true;
    }
});
const isElectron = () => {
    return typeof window !== 'undefined' && typeof window.electron !== 'undefined';
};
const agree = () => {
    showModal.value = false;
    if(isElectron()){
        window.electron.ipcRenderer.send('disclaimer-response', true);
        return;
    }
    localStorage.setItem('disclaimerAccepted', true);
};

const disagree = () => {
    if(isElectron()){
        window.electron.ipcRenderer.send('disclaimer-response', false);
    }
    window.close();
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    max-width: 750px;
    width: 80%;
}

.button-group {
    display: flex;
    justify-content: space-around;
    margin-top: 15px;
}

button {
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    background-color:var(--primary-color);
    color: white;
}

</style>