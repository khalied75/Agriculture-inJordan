 // كود النافبار
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('overlay');
        const closeBtn = document.getElementById('closeBtn');

        // فتح/إغلاق القائمة
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.style.overflow = document.body.style.overflow === 'hidden' ? 'auto' : 'hidden';
        });

        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);

        function closeMenu() {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // إغلاق القائمة عند النقر على رابط
        document.querySelectorAll('.mobile-links a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // تأثيرات scroll للنافبار
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(2, 136, 209, 0.95)';
            } else {
                navbar.style.background = '';
            }
        });

        // إغلاق القائمة عند تغيير حجم الشاشة
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) {
                closeMenu();
            }
        });
    </script>