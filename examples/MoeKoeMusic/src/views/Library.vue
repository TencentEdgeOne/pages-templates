<template>
    <div class="library-page">
        <div class="profile-section">
            <img class="profile-pic" :src="user.pic" alt="{{ $t('yong-hu-tou-xiang') }}" />
            <h2 class="section-title">{{ user.nickname }}<span>{{ $t('de-yin-le-ku') }}</span></h2>
            <img v-if="userVip[0] && userVip[0].is_vip == 1" class="user-level"
                :src="`./assets/images/${userVip[0].product_type === 'svip' ? 'vip' : 'vip2'}.png`"
                :title="`${$t('gai-nian-ban')} ${userVip[0].vip_end_time}`" />
            <img v-if="userVip[1] && userVip[1].is_vip == 1" class="user-level"
                :src="`./assets/images/${userVip[1].product_type === 'svip' ? 'vip' : 'vip2'}.png`"
                :title="`${$t('chang-ting-ban')} ${userVip[1].vip_end_time}`" />
            <span class="sign-in" @click="signIn">签到</span>
            <span class="sign-in" @click="getVip">VIP</span>
        </div>
        <h2 class="section-title" style="margin-bottom: 0px;">{{ $t('wo-xi-huan-ting') }}</h2>
        <div class="favorite-section">
            <div class="song-list">
                <div v-if="isLoading" class="skeleton-loader">
                    <div v-for="n in 16" :key="n" class="skeleton-item">
                        <div class="skeleton-cover"></div>
                        <div class="skeleton-info">
                            <div class="skeleton-line"></div>
                            <div class="skeleton-line short"></div>
                        </div>
                    </div>
                </div>
                <ul v-if="listenHistory.length > 0">
                    <li v-for="(song, index) in listenHistory" :key="index" class="song-item"
                        @click="playSong($getQuality(null, song), song.name.split(' - ')[1] || song.name, $getCover(song.image, 480), song.singername)">
                        <img :src="$getCover(song.image, 120)" class="album-cover" />
                        <div class="song-info">
                            <p class="album-name">{{ song.name.split(' - ')[1] || song.name }}</p>
                            <p class="singer-name">{{ song.singername }}</p>
                        </div>
                    </li>
                </ul>
                <el-empty v-else :description="t('zhe-li-shi-mo-du-mei-you')" />
            </div>
        </div>

        <!-- 分类导航 -->
        <div class="category-tabs">
            <button v-for="(tab, index) in categories" :key="index" :class="{ 'active': selectedCategory === index }"
                @click="selectCategory(index)">
                {{ tab }}
            </button>
        </div>

        <!-- 音乐卡片网格（显示歌单或关注的歌手） -->
        <div class="music-grid">
            <template v-if="selectedCategory === 0 || selectedCategory === 1 || selectedCategory === 2">
                <div v-if="selectedCategory === 0 && !isLoading" class="music-card create-playlist-button" @click="goToCloudDrive">
                    <img :src="`./assets/images/cloud-disk.png`" class="album-image" />
                    <div class="album-info">
                        <h3>我的云盘</h3>
                        <p>(*/ω＼*)</p>
                    </div>
                </div>
                <div class="music-card"
                    v-for="(item, index) in (selectedCategory === 0 ? userPlaylists : selectedCategory === 1 ? collectedPlaylists : collectedAlbums)"
                    :key="index">
                    <router-link :to="{
                        path: '/PlaylistDetail',
                        query: { global_collection_id: item.list_create_gid || item.global_collection_id, listid: item.listid}
                    }">
                        <img :src="item.pic ? $getCover(item.pic, 480) : './assets/images/live.png'"
                            class="album-image" />
                        <div class="album-info">
                            <h3>{{ item.name }}</h3>
                            <p>{{ item.count }} <span>{{ $t('shou-ge') }}</span></p>
                        </div>
                    </router-link>
                </div>
                <div v-if="selectedCategory === 0 && !isLoading" class="music-card create-playlist-button" @click="createPlaylist">
                    <i class="fas fa-plus"></i>
                    <img :src="`./assets/images/ti111mg.png`" class="album-image" />
                    <div class="album-info">
                        <h3>{{ $t('chuang-jian-ge-dan') }}</h3>
                        <p>(≧∀≦)♪</p>
                    </div>
                </div>
            </template>
            <div v-if="selectedCategory === 3 || selectedCategory === 4" class="music-card"
                v-for="(artist, index) in (selectedCategory === 3 ? followedArtists : selectedCategory === 4 ? collectedFriends  : [])" :key="index"
                @click="goToArtistDetail(artist)">
                <img :src="artist.pic" class="album-image" />
                <div class="album-info">
                    <h3>{{ artist.nickname }}</h3>
                </div>
            </div>
        </div>
        <el-empty v-if="
        (selectedCategory == 0 && userPlaylists.length === 0) || 
        (selectedCategory == 1 && collectedPlaylists.length === 0) || 
        (selectedCategory == 2 && collectedAlbums.length === 0) || 
        (selectedCategory == 3 && followedArtists.length === 0) || 
        (selectedCategory == 4 && collectedFriends.length === 0)"
            :description="t('zhe-li-shi-mo-du-mei-you')" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { get } from '../utils/request';
import { MoeAuthStore } from '../stores/store';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const router = useRouter();
const MoeAuth = MoeAuthStore();
const user = ref({});
const userPlaylists = ref([]); // 创建的歌单
const collectedPlaylists = ref([]); // 收藏的歌单
const collectedAlbums = ref([]); // 收藏的专辑
const collectedFriends = ref([]); // 好友
const followedArtists = ref([]); // 关注的歌手
const listenHistory = ref([]); // 听歌历史
const userVip = ref({});
const categories = ref([t('wo-chuang-jian-de-ge-dan'), t('wo-shou-cang-de-ge-dan'), t('wo-shou-cang-de-zhuan-ji'), t('wo-guan-zhu-de-ge-shou'), t('wo-guan-zhu-de-hao-you')]);
const selectedCategory = ref(0);
const isLoading = ref(true); 
const selectCategory = (index) => {
    selectedCategory.value = index;
    router.replace({ path: '/library', query: { category: index } });
};

const playSong = (hash, name, img, author) => {
    props.playerControl.addSongToQueue(hash, name, img, author);
};

const props = defineProps({
    playerControl: Object
});

onMounted(() => {
    if (MoeAuth.isAuthenticated) {
        user.value = MoeAuth.UserInfo;
        // 获取用户vip信息
        getVipInfo();
    }
});
const getUserDetails = () => {
    // 获取用户听歌历史
    getlisten().finally(() => {
        isLoading.value = false; 
    })
    // 获取用户创建和收藏的歌单
    getplaylist()
    // 获取用户关注的歌手
    getfollow()
    selectedCategory.value = parseInt(router.currentRoute.value.query.category || 0);
}
const getVipInfo = async () => {
    try {
        const VipInfoResponse = await get('/user/vip/detail');
        if (VipInfoResponse.status === 1) {
            userVip.value = VipInfoResponse.data.busi_vip
            getUserDetails();
        }
    } catch (error) {
        window.$modal.alert(t('deng-lu-shi-xiao-qing-zhong-xin-deng-lu'));
        router.push('/login');
    }
}

const getlisten = async () => {
    const historyResponse = await get('/user/listen', { type: 1 });
    if (historyResponse.status === 1) {
        const allLists = historyResponse.data.lists;
        const shuffled = allLists.sort(() => 0.5 - Math.random());
        listenHistory.value = shuffled.slice(0, 16);
    }
}
const getfollow = async () => {
    const followResponse = await get('/user/follow');
    if (followResponse.status === 1) {
        if (followResponse.data.total == 0) return;
        const artists = followResponse.data.lists.map(artist => ({
            ...artist,
            pic: artist.pic.replace('/100/', '/480/')
        }));
        collectedFriends.value = artists.filter(artist => !artist.singerid);
        followedArtists.value = artists.filter(artist => artist.source == 7);
    }
}
const getplaylist = async () => {
    try {
        const playlistResponse = await get('/user/playlist',{
            pagesize:100,
            t: localStorage.getItem('t')
        });
        if (playlistResponse.status === 1) {
            userPlaylists.value = playlistResponse.data.info.filter(playlist => {
                if (playlist.name == '我喜欢') {
                    localStorage.setItem('like', playlist.listid);
                }
                return playlist.list_create_userid === user.value.userid || playlist.name === '我喜欢';
            }).sort((a, b) => a.name === '我喜欢' ? -1 : 1);
            collectedPlaylists.value = playlistResponse.data.info.filter(playlist => playlist.list_create_userid !== user.value.userid && !playlist.authors);
            collectedAlbums.value = playlistResponse.data.info.filter(playlist => playlist.list_create_userid !== user.value.userid && playlist.authors);
            
            const collectedIds = [];
            playlistResponse.data.info.forEach(playlist => {
                if (playlist.list_create_userid !== user.value.userid) {
                    collectedIds.push({list_create_listid:playlist.list_create_listid, listid:playlist.listid});
                }
            });
            localStorage.setItem('collectedPlaylists', JSON.stringify(collectedIds));
        }
    } catch (error) {
        window.$modal.alert(t('xin-zeng-zhang-hao-qing-xian-zai-guan-fang-ke-hu-duan-zhong-deng-lu-yi-ci')); 
    }
}
const createPlaylist = async () => {
    const result = await window.$modal.prompt(t('qing-shu-ru-xin-de-ge-dan-ming-cheng'), '');
    if (result) {
        try {
            const playlistResponse = await get('/playlist/add', { name: result, list_create_userid: user.value.userid });
            if (playlistResponse.status === 1) {
                localStorage.setItem('t', Date.now());
                getplaylist()
            }
        } catch (error) {
            window.$modal.alert(t('chuang-jian-shi-bai'));
        }
    }
}

const goToCloudDrive= () => {
    router.push('/CloudDrive');
}

const goToArtistDetail = (artist) => {
    if (!artist.singerid) return;
    router.push({
        path: '/PlaylistDetail',
        query: { 
            singerid: artist.singerid,
            unfollow: true
        }
    });
};
const signIn = async () => {
    try {
        const res = await get('/youth/vip');
        if (res.status === 1) {
            window.$modal.alert(`签到成功，获得${res.data.award_vip_hour}小时VIP时长`);
        }
    } catch (error) {
        window.$modal.alert('签到失败，请勿频繁签到');
    }
}
const getVip = async () => {
    try{
        const vipResponse = await get('/youth/day/vip');
        if (vipResponse.status === 1) {
            window.$modal.alert(`签到成功，获得1天畅听VIP`);
        }
    } catch (error) {
        window.$modal.alert('获取VIP失败, 一天仅限一次');
    }
}
</script>

<style scoped>
.sign-in {
    cursor: pointer;
    color: var(--primary-color);
    margin-left: 10px;
    border-radius: 5px;
    padding: 2px 8px;
    border: 1px solid var(--primary-color);
    font-size: 12px;
}

.library-page {
    padding: 20px;
}

.user-level {
    width: 50px;
    margin-left: 10px;
    cursor: pointer;
}


.section-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 30px;
    color: var(--primary-color);
}

.profile-section {
    display: flex;
    align-items: center;
}

.profile-pic {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    margin-right: 15px;
}

.favorite-section {
    display: flex;
    justify-content: space-between;
}

.favorite-playlist {
    background-color: var(--background-color);
    padding: 20px;
    border-radius: 12px;
    flex: 1;
    margin-right: 20px;
    border: 1px solid var(--secondary-color);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.playlist-info p {
    margin: 10px 0;
}

.play-button {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background-color: var(--secondary-color);
    color: white;
    border: none;
    border-radius: 25px;
    padding: 10px 15px;
    cursor: pointer;
}

.play-button i {
    font-size: 16px;
}

.song-list {
    flex: 1;
}

.song-list ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.song-list li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    width: 250px;
    cursor: pointer;
    border-radius: 10px;
    padding-left: 10px;
}

.song-list li:hover {
    background-color: var(--background-color);
}

.song-list img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    border-radius: 6px;
}

.category-tabs {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.category-tabs button {
    padding: 10px 15px;
    border: none;
    background-color: #f5f5f5;
    border-radius: 20px;
    cursor: pointer;
}

.category-tabs button.active {
    background-color: var(--primary-color);
    color: white;
}

.music-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
}

.music-card {
    text-align: center;
    cursor: pointer;
}

.album-image {
    width: 100%;
    border-radius: 12px;
}

.album-info h3 {
    margin: 10px 0 5px;
    font-size: 16px;
}

.album-info p {
    color: #666;
    font-size: 14px;
}

.song-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.album-cover {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    border-radius: 5px;
}

.song-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 190px;
}

.album-name,
.singer-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.album-name {
    font-weight: bold;
    margin-bottom: -5px;
    font-size: 14px;
    color: #333;
}

.singer-name {
    font-size: 12px;
    color: #666;
}

.skeleton-loader {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 10px;
}

.skeleton-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    width: 250px;
    border-radius: 10px;
    padding-left: 10px;
    background-color: #f0f0f0;
    height: 68px;
}

.skeleton-cover {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    border-radius: 10px;
    background-color: #e0e0e0;
}

.skeleton-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 190px;
}

.skeleton-line {
    height: 10px;
    background-color: #e0e0e0;
    margin-bottom: 5px;
    border-radius: 5px;
    width: 150px;
}

.create-playlist-button {
    color: var(--primary-color);
    border-radius: 10px;
    cursor: pointer;
    position: relative;
}

.create-playlist-button i {
    font-size: 30px;
    position: absolute;
    top: 32%;
    left: 29%;
}
</style>