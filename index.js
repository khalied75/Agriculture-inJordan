// عناصر القائمة
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');
const mobileLinks = document.querySelectorAll('.mobile-links a');

// فتح/إغلاق القائمة
function toggleMenu() {
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
}

hamburger.addEventListener('click', toggleMenu);

// إغلاق القائمة عند الضغط على overlay
overlay.addEventListener('click', toggleMenu);

// إغلاق القائمة عند الضغط على أي رابط
mobileLinks.forEach(link => {
    link.addEventListener('click', toggleMenu);
});

// التمرير السلس
function scrollToContent() {
    document.querySelector('.sections-grid').scrollIntoView({
        behavior: 'smooth'
    });
}

// التنقل السلس للروابط
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            if (window.innerWidth <= 768 && mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// إغلاق القائمة عند تكبير الشاشة
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
        toggleMenu();
    }
});

// تأثيرات scroll للنافبار
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(46, 125, 50, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '';
        navbar.style.backdropFilter = '';
    }
});
