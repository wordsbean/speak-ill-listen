/* ============================================================
   no-devtools.js
   -------------------------------------------------------------
   우클릭 메뉴 + F12/개발자도구 단축키를 막는 간단한 억제 스크립트.
   참고: 이건 완벽한 보안이 아니라 캐주얼한 복사/우클릭을 막는
   수준이에요 — 브라우저 메뉴(⋮ → 도구 더보기 → 개발자 도구) 등으로는
   여전히 열 수 있고, 마음먹은 사용자를 100% 막을 수는 없습니다.
   ============================================================ */
(function(){
  // 우클릭(컨텍스트 메뉴) 차단
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // 개발자도구 관련 단축키 차단
  document.addEventListener('keydown', (e) => {
    // F12
    if(e.key === 'F12'){
      e.preventDefault();
      return;
    }
    // Ctrl+Shift+I / J / C (개발자도구, 콘솔, 요소검사)
    if((e.ctrlKey || e.metaKey) && e.shiftKey && ['I','J','C','i','j','c'].includes(e.key)){
      e.preventDefault();
      return;
    }
    // Ctrl+U (페이지 소스 보기)
    if((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')){
      e.preventDefault();
      return;
    }
  });
})();
