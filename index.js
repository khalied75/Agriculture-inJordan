 // عناصر القائمة
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('overlay');
        const closeBtn = document.getElementById('closeBtn');
        const mobileLinks = document.querySelectorAll('.mobile-links a');

        // فتح القائمة
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // إغلاق القائمة
        function closeMenu() {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);

        // إغلاق القائمة عند النقر على رابط
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
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
                    // إغلاق القائمة المتنقلة إذا كانت مفتوحة
                    if (window.innerWidth <= 768) {
                        closeMenu();
                    }
                    
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // إغلاق القائمة عند تغيير حجم الشاشة
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
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