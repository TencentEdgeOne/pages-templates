import { createRouter, createWebHashHistory } from 'vue-router';
import HomeLayout from '@/layouts/HomeLayout.vue';
import Home from '@/views/Home.vue';
import Discover from '@/views/Discover.vue';
import Library from '@/views/Library.vue';
import Login from '@/views/Login.vue';
import Settings from '@/views/Settings.vue';
import PlaylistDetail from '@/views/PlaylistDetail.vue';
import Search from '@/views/Search.vue';
import Lyrics from '@/views/Lyrics.vue';
import Ranking from '@/views/Ranking.vue';
import CloudDrive from '@/views/CloudDrive.vue';
import { MoeAuthStore } from '@/stores/store';


const routes = [
    {
        path: '/',
        component: HomeLayout,
        children: [
            { path: '', name: 'Index', component: Home },
            { path: '/share', name: 'Share', component: Home },
            { path: '/discover', name: 'Discover', component: Discover },
            { path: '/library', name: 'Library', component: Library, meta: { requiresAuth: true } },
            { path: '/login', name: 'Login', component: Login },
            { path: '/settings', name: 'Settings', component: Settings },
            { path: '/playlistDetail', name: 'PlaylistDetail', component: PlaylistDetail },
            { path: '/search', name: 'Search', component: Search },
            { path: '/ranking', name: 'Ranking', component: Ranking },
            { path: '/CloudDrive', name: 'CloudDrive', component: CloudDrive },
        ],
    },
    { path: '/lyrics', name: 'Lyrics', component: Lyrics },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        ...savedPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            });
        }
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
                top: 80, 
            };
        }
        if (to.path === from.path && JSON.stringify(to.params) === JSON.stringify(from.params)) {
            return false;
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ top: 0, behavior: 'smooth' });
            }, 50);
        });
    }
});

// 全局导航守卫
router.beforeEach((to, from, next) => {
    console.log('完整的路由地址:', to.fullPath);
    const MoeAuth = MoeAuthStore()
    // 检查是否需要登录
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!MoeAuth.isAuthenticated) {
            next({
                path: '/login',
                query: { redirect: to.fullPath } 
            });
        } 
    } 
    next();
});

export default router;