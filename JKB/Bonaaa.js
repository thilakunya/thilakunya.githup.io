document.addEventListener('DOMContentLoaded', () => {
    const heartContainer = document.getElementById('heartContainer');
    const filledHeart = document.getElementById('filledHeart');
    const valentineCard = document.getElementById('valentineCard');
    const noteElement = document.getElementById('typingNote');
    const greetingElement = document.getElementById('animatedGreeting');
    const bgMusic = document.getElementById('bgMusic');

    // 1. แยกตัวอักษร "Happy Valentine's Day" เพื่อให้ลอยทีละตัว
    const greetingText = greetingElement.textContent;
    greetingElement.innerHTML = '';
    [...greetingText].forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.animationDelay = `${i * 0.1}s`;
        greetingElement.appendChild(span);
    });

    // 2. เก็บข้อความไว้ แล้วลบออกจากหน้าจอเพื่อรอพิมพ์
    const fullNoteText = noteElement.textContent;
    noteElement.textContent = ''; 
    
    let pressTimer;

    function startPress(e) {
        // ป้องกันเมนูคลิกขวาบนมือถือ
        if (e.cancelable && e.type === 'touchstart') e.preventDefault(); 
        
        // สั่งให้หัวใจขยายเต็ม 120% (CSS transition จะทำให้มันค่อยๆ ขึ้นเอง)
        filledHeart.style.transform = 'scale(1.2)'; 

        pressTimer = setTimeout(() => {
            // เมื่อกดค้างครบ 1 วินาที
            heartContainer.style.opacity = '0'; // ค่อยๆ จางหายไป
            heartContainer.style.pointerEvents = 'none'; // ปิดการกดซ้ำ
            
            setTimeout(() => {
                heartContainer.style.display = 'none';
                valentineCard.classList.add('show');
                
                // เริ่มเล่นเพลง (Volume 50%)
                bgMusic.volume = 0.5;
                bgMusic.play().catch(console.error);

                // เริ่มพิมพ์ข้อความหลังจากรูปโพลารอยด์เด้งขึ้นมาแล้ว (รอ 1.2 วินาที)
                setTimeout(() => {
                    typeWriter(fullNoteText, noteElement, 40); // ความเร็วพิมพ์ 40ms ต่อตัวอักษร
                }, 1200);
            }, 500); // รอให้หัวใจจางหายไปก่อนค่อยโชว์การ์ด

        }, 1000); // ต้องกดค้าง 1 วินาที
    }

    function endPress() {
        clearTimeout(pressTimer);
        // ถ้าปล่อยมือก่อนเวลา และการ์ดยังไม่โชว์ ให้หัวใจแฟบกลับไป
        if (!valentineCard.classList.contains('show')) {
            filledHeart.style.transform = 'scale(0)';
        }
    }

    function typeWriter(text, element, speed) {
        let i = 0;
        function typing() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            }
        }
        typing();
    }

    // รองรับทั้ง Mouse (คอมพิวเตอร์) และ Touch (มือถือ)
    heartContainer.addEventListener('mousedown', startPress);
    heartContainer.addEventListener('touchstart', startPress, {passive: false});
    window.addEventListener('mouseup', endPress);
    window.addEventListener('touchend', endPress);
});