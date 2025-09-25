'use client';

import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  created_at: string;
}

// 假设你有一个getURL函数，如果没有可以替换为直接的URL
const getURL = (path: string) => path;

export function Account({ onSignOut, loggedIn, user }: { 
  onSignOut?: () => void, 
  loggedIn: boolean | null, 
  user: User | null 
}) { 
  const router = useRouter(); 

  const handleSignOut = async () => {
    try {
      // 先执行客户端清理 - 仿照AccountClient.tsx的实现
      if (typeof window !== 'undefined') {
        // 清理localStorage中的认证相关数据
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.includes('supabase') || key.includes('sb-') || key.includes('auth'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // 清理sessionStorage中的认证相关数据
        const sessionKeysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (key.includes('supabase') || key.includes('sb-') || key.includes('auth'))) {
            sessionKeysToRemove.push(key);
          }
        }
        sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
      }

      // 调用服务端登出接口
      const res = await fetch(getURL("/auth/signout"), { 
        method: "GET", 
        credentials: "include" 
      }); 

      if (res.status === 200) { 
        // 执行传入的回调函数
        onSignOut?.(); 
        
        // 导航到登录页面
        router.push("/signin"); 
      } else {
        console.error('Sign out failed:', res.statusText);
        // 即使服务端登出失败，也执行客户端清理和重定向
        onSignOut?.();
        router.push("/signin");
      }
    } catch (error) {
      console.error('Sign out error:', error);
      // 即使出错，也要确保用户被重定向
      onSignOut?.();
      router.push("/signin");
    }
  };

  // 如果用户未登录，不显示组件
  if (!loggedIn || !user) {
    return null;
  }

  return (
    <div className="account-container">
      <h2>Account Information</h2>
      <div className="user-info">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
        <p><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
      </div>
      
      <button 
        onClick={handleSignOut}
        className="signout-button"
        style={{
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

export default Account;