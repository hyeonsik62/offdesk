function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    }
    return Math.floor(num);
}

const counters = document.querySelectorAll('.count');

counters.forEach(counter => {
    const target = Number(counter.dataset.target);
    const duration = 3000;

    let startTime = null;

    function update(timestamp) {
        if (!startTime) startTime = timestamp;

        const progress = Math.min((timestamp - startTime) / duration, 1);

        // 애니메이션 중
        counter.textContent = formatNumber(progress * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            // 최종값도 같은 형식으로 표시
            counter.textContent = formatNumber(target);
        }
    }

    requestAnimationFrame(update);
});