document.addEventListener("DOMContentLoaded", function () {

    // 1. 스크롤 위치 초기화
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const body = document.querySelector('body');
    const headerWrap = document.getElementById('header_wrap');
    const canvas = document.getElementById('video-canvas');
    const context = canvas.getContext('2d');

    const frameCount = 176; // 추출하신 프레임 개수에 맞게 176으로 수정!
    let currentFrame = 1;
    let targetFrame = 1;
    let isCompleted = false;
    const images = [];

    // -------------------------------------------------------------
    // [실제 프레임 이미지 불러오기]
    // HTML 파일과 같은 위치에 'images' 라는 폴더가 있고, 
    // 그 안에 파일들이 들어있다고 가정된 경로입니다.
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();

        // i가 1일 때 파일번호는 1000, i가 176일 때 1175가 되도록 계산
        const fileNumber = 999 + i;

        // 이미지 경로 설정 (폴더명이나 경로가 다르면 'images/' 부분을 수정하세요)
        img.src = `./videos/offdesk_mainbanner_${fileNumber}.jpg`;
        images.push(img);
    }
    // -------------------------------------------------------------

    // 첫 번째 이미지(1000번) 로드 완료 시 화면에 그리기
    images[0].onload = () => {
        context.drawImage(images[0], 0, 0, canvas.width, canvas.height);
    };

    // 렌더링 애니메이션 (부드러운 LERP 효과)
    function render() {
        if (isCompleted) return;

        currentFrame += (targetFrame - currentFrame) * 0.1;

        let frameIndex = Math.round(currentFrame) - 1;

        if (images[frameIndex] && images[frameIndex].complete) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            // 이미지를 캔버스 크기에 꽉 차게 그리기
            context.drawImage(images[frameIndex], 0, 0, canvas.width, canvas.height);
        }

        // 시퀀스 완료 조건 (마지막 프레임 176에 도달)
        if (currentFrame >= frameCount - 0.5) {
            currentFrame = frameCount;
            isCompleted = true;

            // 스크롤 잠금 해제
            body.classList.remove('no-scroll');
            if (headerWrap) headerWrap.classList.add('active');
            return;
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    // 마우스 휠 이벤트 가로채기
    window.addEventListener('wheel', (e) => {
        if (!body.classList.contains('no-scroll') || isCompleted) {
            return;
        }

        e.preventDefault();

        if (e.deltaY > 0) {
            // 민감도: 숫자가 클수록 휠을 많이 굴려야 함. 
            // 너무 빨리 넘어가면 30이나 40으로 올려보세요.
            const sensitivity = 20;
            targetFrame += (e.deltaY / sensitivity);

            if (targetFrame > frameCount) {
                targetFrame = frameCount;
            }
        }
        // 위로 올릴 때 다시 뒤로 감기게 하려면 아래 주석을 푸세요.
        /*
        else if (e.deltaY < 0) {
            const sensitivity = 20;
            targetFrame += (e.deltaY / sensitivity);
            if (targetFrame < 1) targetFrame = 1;
        }
        */
    }, { passive: false });

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