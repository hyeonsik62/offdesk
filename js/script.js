document.addEventListener("DOMContentLoaded", function () {

    if ('scrollRestoration' in history) {
        // 브라우저가 스크롤 위치를 기억하는 자동(auto) 기능을 수동(manual)으로 끕니다.
        history.scrollRestoration = 'manual';
    }
    // 페이지 로드 시 무조건 맨 위(0, 0)로 텔레포트 시킵니다.
    window.scrollTo(0, 0);

    const body = document.querySelector('body');
    const headerWrap = document.getElementById('header_wrap');
    const mainVideo = document.querySelector('.mainbanner video');

    console.log("스크립트 시작, 비디오 요소:", mainVideo);

    // 1. 패딩 계산 로직 삭제, 단순히 스크롤만 잠금
    if (body) {
        body.classList.add('no-scroll');
    }

    if (mainVideo) {
        mainVideo.addEventListener('ended', function () {
            console.log("비디오 재생 끝!");

            // 2. 패딩 초기화 로직 삭제, 스크롤 잠금만 해제
            body.classList.remove('no-scroll');
            if (headerWrap) headerWrap.classList.add('active');
        });
    } else {
        console.warn("메인 비디오를 찾을 수 없습니다. 스크롤 잠금을 해제합니다.");

        // 3. 예외 상황에서도 스크롤 잠금만 해제
        if (body) {
            body.classList.remove('no-scroll');
        }
        if (headerWrap) {
            headerWrap.classList.add('active');
        }
    }

    // =======================================================
    // 2. Swiper 슬라이드 복제 및 초기화
    // =======================================================
    const wrapper = document.querySelector('.card .swiper-wrapper');

    // wrapper 요소가 존재하는 페이지에서만 Swiper 코드 실행
    if (wrapper) {
        wrapper.innerHTML += wrapper.innerHTML; // 슬라이드 복제

        const swiper = new Swiper(".card", {
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            loop: true,
            slidesPerView: 3,
            centeredSlides: true,
            spaceBetween: 60,
        });
    }

    // =======================================================
    // 3. 패럴랙스(Parallax) 배경 스크롤 효과
    // =======================================================
    const parallaxBg = document.querySelector('.parallax_bg');
    const banner = document.querySelector('.subbanner_1');

    if (parallaxBg && banner) {
        window.addEventListener('scroll', function () {
            let bannerTop = banner.getBoundingClientRect().top;
            parallaxBg.style.transform = `translateY(${-(bannerTop * 0.3)}px)`;
        });
    }

    // =======================================================
    // 4. 스크롤 애니메이션 (Intersection Observer)
    // =======================================================
    const elements = document.querySelectorAll('.scroll-animate');

    if (elements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animationName = entry.target.dataset.animation;
                    // dataset에 애니메이션 이름이 있을 때만 추가
                    if (animationName) {
                        entry.target.classList.add('animate__animated', animationName);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        elements.forEach(el => observer.observe(el));
    }

    // =======================================================
    // 5. Helpful 버튼 클릭 이벤트 (단일 + 복수 처리)
    // =======================================================

    // 1. 클래스로 모든 버튼을 선택합니다.
const helpfulBoxes = document.querySelectorAll('.helpful_box_1');

// 2. 루프를 돌며 각각의 버튼에 이벤트를 등록합니다.
helpfulBoxes.forEach((box) => {
    box.addEventListener('click', function (e) {
        // a 태그의 기본 동작(페이지 상단으로 튕기는 현상)을 방지합니다.
        e.preventDefault();

        // 클릭된 요소에만 'active' 클래스를 토글합니다.
        this.classList.toggle('active');
        
        // (선택사항) 클릭 상태일 때 로그를 확인해보고 싶다면 아래 주석을 해제하세요.
        // console.log("버튼 상태 변경됨:", this.classList.contains('active'));
    });
});

}); // DOMContentLoaded 끝