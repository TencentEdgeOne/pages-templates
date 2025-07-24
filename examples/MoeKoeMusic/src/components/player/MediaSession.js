export default function useMediaSession() {
  // 初始化媒体会话
  const initMediaSession = (handlers) => {
    if (!("mediaSession" in navigator) || !navigator.mediaSession) return;
    
    navigator.mediaSession.setActionHandler('play', handlers.togglePlayPause);
    navigator.mediaSession.setActionHandler('pause', handlers.togglePlayPause);
    navigator.mediaSession.setActionHandler('previoustrack', handlers.playPrevious);
    navigator.mediaSession.setActionHandler('nexttrack', handlers.playNext);
  };
  
  // 更新媒体会话信息
  const changeMediaSession = (song) => {
    if (!("mediaSession" in navigator) || !navigator.mediaSession) return;

    const defaultArtwork = './assets/images/logo.png';
    const checkImageAccessibility = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => resolve(defaultArtwork);
        img.src = src;
      });
    };

    const updateMediaSession = async () => {
      try {
        const artworkSrc = await checkImageAccessibility(song.img || defaultArtwork);
        navigator.mediaSession.metadata = new MediaMetadata({
          title: song.name,
          artist: song.author,
          album: song.album,
          artwork: [{ src: artworkSrc }]
        });
      } catch (error) {
        console.error("Failed to update media session metadata:", error);
      }
    };
    
    updateMediaSession();
  };
  
  return {
    initMediaSession,
    changeMediaSession
  };
} 