// 1. 네비게이션 안의 모든 <a> 태그를 가져옵니다.
const allLinks = document.querySelectorAll('.pagination_section a');

// 2. 글자가 '숫자'인 것들만 추려내서 배열로 만듭니다. (1, 2, 3, 4, 5)
const numberLinks = Array.from(allLinks).filter(link => !isNaN(Number(link.textContent)));

// 3. 클래스를 옮겨주는 작업을 '함수'로 따로 빼서 재사용하기 쉽게 만듭니다.
function setActivePage(targetLink) {
    // 기존에 불이 켜진 버튼 찾아서 끄기
    const currentActive = document.querySelector('.Current_page');
    if (currentActive) {
        currentActive.classList.remove('Current_page');
        currentActive.removeAttribute('aria-current'); // 웹 접근성 속성 제거
    }

    // 새로 지정된 버튼에 불 켜기
    targetLink.classList.add('Current_page');
    targetLink.setAttribute('aria-current', 'page'); // 웹 접근성 속성 추가
}

// 4. 모든 링크에 클릭 이벤트를 달아줍니다.
allLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // 화면 튕김 방지
        
        // 클릭한 버튼의 글자를 가져옵니다. (First, Last, 1, 2...)
        const text = this.textContent.trim();

        if (text === 'First') {
            // First를 누르면 숫자 배열의 첫 번째[0] (즉, 1번) 버튼에 불을 켭니다.
            setActivePage(numberLinks[0]);
            
        } else if (text === 'Last') {
            // Last를 누르면 숫자 배열의 맨 마지막 (즉, 5번) 버튼에 불을 켭니다.
            setActivePage(numberLinks[numberLinks.length - 1]);
            
        } else if (!isNaN(Number(text))) {
            // 숫자(1, 2, 3...)를 직접 누른 경우, 누른 버튼(this)에 불을 켭니다.
            setActivePage(this);
        }
    });
});

// 1. 카테고리 리스트 안의 모든 <a> 태그를 선택합니다.
const categoryLinks = document.querySelectorAll('.category_list > li > a');

// 2. 선택한 각각의 링크에 클릭 이벤트를 달아줍니다.
categoryLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        
        // 3. <a> 태그의 기본 이동 기능 막기 
        // (href="#" 때문에 클릭 시 화면 맨 위로 튕기는 현상을 방지합니다)
        e.preventDefault();

        // 4. 일단 모든 링크에서 'Current_category' 클래스를 지워줍니다.
        categoryLinks.forEach(item => {
            item.classList.remove('Current_category');
        });

        // 5. 방금 클릭한 링크에만 'Current_category' 클래스를 추가합니다.
        this.classList.add('Current_category');
    });
});

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. 현재 URL 주소에서 꼬리표(파라미터)를 읽어옵니다.
    const urlParams = new URLSearchParams(window.location.search);
    const targetCategory = urlParams.get('category'); // 예: 'table', 'bed' 등이 담김

    // 꼬리표가 존재할 때만 실행
    if (targetCategory) {
        const categoryLinks = document.querySelectorAll('.category_list a');

        // 2. 먼저 모든 메뉴에서 Current_category 클래스를 지웁니다.
        categoryLinks.forEach(link => link.classList.remove('Current_category'));

        // 3. 링크들을 하나씩 확인하면서 꼬리표와 이름이 같은 것을 찾습니다.
        categoryLinks.forEach(link => {
            // a 태그 안에 적힌 글자(Sofa, Table 등)를 가져와서 소문자로 변환해 비교
            const linkText = link.textContent.trim().toLowerCase();
            
            if (linkText === targetCategory.toLowerCase()) {
                // 이름이 일치하면 클래스를 붙여줍니다.
                link.classList.add('Current_category');
            }
        });
    }
});