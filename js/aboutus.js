document.addEventListener("DOMContentLoaded", function() {
    const origamiWrapper = document.querySelector('.origami-wrapper');

    function checkScroll() {
        if (!origamiWrapper) return;

        // IDENTITY 섹션이 현재 화면에서 어느 위치에 있는지 자동으로 계산합니다.
        const rect = origamiWrapper.getBoundingClientRect();
        
        if (rect.top < window.innerHeight - 300) {
            origamiWrapper.classList.add('is-open');
            
            // 한 번 펼쳐졌으므로 스크롤 감지를 완전히 종료합니다. (성능 최적화)
            window.removeEventListener('scroll', checkScroll);
        }
    }

    // 사용자가 스크롤할 때마다 위치를 확인합니다.
    window.addEventListener('scroll', checkScroll);
    
    // 페이지 로드(또는 새로고침) 시 스크롤이 이미 내려와 있는 경우를 대비해 즉시 실행합니다.
    checkScroll();
});