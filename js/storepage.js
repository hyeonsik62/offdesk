function customSmoothScroll(targetY, duration) {
    const startY = window.scrollY; // 현재 스크롤 위치
    const difference = targetY - startY; // 이동해야 할 거리
    const startTime = performance.now(); // 애니메이션 시작 시간

    function step(currentTime) {
        let progress = (currentTime - startTime) / duration; // 진행률 (0 ~ 1)
        
        if (progress > 1) progress = 1; // 1을 넘지 않도록 제한

        // 도착할 때 스르륵 멈추는 Easing 공식 적용 (easeOutQuart)
        const ease = 1 - Math.pow(1 - progress, 4); 

        // 계산된 위치로 화면 이동
        window.scrollTo(0, startY + difference * ease);

        // 진행률이 1(100%)보다 작으면 계속 애니메이션 실행
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}customSmoothScroll


// 1. 따라다닐 리스트와 그것을 감싸는 부모 영역 선택
const storeList = document.querySelector('.Store_list');
const container = document.querySelector('.Store_list_section');


// 변수 설정
let currentY = 0; // 현재 리스트의 시각적 위치
let targetY = 0;  // 리스트가 가야 할 목표 위치
const ease = 0.2; // 따라오는 속도 (0.01 ~ 0.1 사이 권장. 낮을수록 더 스르륵 따라옵니다)
const topMargin = 100; // 화면 위쪽에서 띄우고 싶은 여백 (기존 top: 100px과 같은 역할)

function animateFloatingMenu() {
    // 부모 컨테이너의 문서 내 절대 위치 계산
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    
    // 리스트가 움직일 수 있는 최대 높이 (부모 영역 바닥을 벗어나지 않게)
    const maxScroll = container.offsetHeight - storeList.offsetHeight;
    
    const scrollY = window.scrollY;

    // 화면 스크롤이 부모 영역 위치에 도달했을 때
    if (scrollY > containerTop - topMargin) {
        targetY = scrollY - containerTop + topMargin;
        
        // 최대 높이를 넘어가면 바닥에 고정
        if (targetY > maxScroll) {
            targetY = maxScroll;
        }
    } else {
        // 스크롤이 위로 올라가면 원래 위치로
        targetY = 0; 
    }

    // 부드러운 이동 공식 (Lerp)
    currentY += (targetY - currentY) * ease;

    // 실제로 리스트 위치 이동 (성능에 가장 좋은 translateY 사용)
    storeList.style.transform = `translateY(${currentY}px)`;

    // 모니터 주사율에 맞춰 부드럽게 무한 반복
    requestAnimationFrame(animateFloatingMenu);
}

// 함수 실행
animateFloatingMenu();