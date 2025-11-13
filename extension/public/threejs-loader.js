// Three.js Spinner 동적 로더
// CSP 정책 준수를 위한 외부 스크립트

(async function loadThreeJsSpinner() {
  try {
    // Vite manifest 조회
    const manifestResponse = await fetch(chrome.runtime.getURL('.vite/manifest.json'));
    const manifest = await manifestResponse.json();

    // threejs-spinner entry 찾기
    const entry = manifest['src/pages/threejs-spinner/index.tsx'];

    if (entry && entry.file) {
      // 동적으로 스크립트 로드
      const script = document.createElement('script');
      script.type = 'module';
      script.src = chrome.runtime.getURL(entry.file);

      script.onload = () => {
        console.log('✅ Three.js spinner loaded successfully');
      };

      script.onerror = (err) => {
        console.error('❌ Failed to load Three.js spinner:', err);
      };

      document.body.appendChild(script);
    } else {
      console.error('❌ Three.js spinner entry not found in manifest');
    }
  } catch (error) {
    console.error('❌ Failed to load Three.js spinner:', error);
  }
})();
