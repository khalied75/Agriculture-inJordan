 // بيانات JSON
        const agricultureData = {
            landDistribution: {
                labels: ['Irrigated Land', 'Rain-fed Land', 'Greenhouses', 'Fruit Orchards'],
                data: [12, 45, 8, 25],
                colors: ['#4caf50', '#8bc34a', '#cddc39', '#ffeb3b']
            },
            productionTrends: {
                years: ['2018', '2019', '2020', '2021', '2022', '2023'],
                vegetables: [850, 920, 810, 950, 980, 1020],
                fruits: [650, 680, 720, 750, 790, 820]
            }
        };

        // إصلاح النافبار - كود مبسط
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

        // المخططات
        document.addEventListener('DOMContentLoaded', function() {
            // مخطط توزيع الأراضي
            new Chart(document.getElementById('landChart'), {
                type: 'doughnut',
                data: {
                    labels: agricultureData.landDistribution.labels,
                    datasets: [{
                        data: agricultureData.landDistribution.data,
                        backgroundColor: agricultureData.landDistribution.colors
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });

            // مخطط اتجاهات الإنتاج
            new Chart(document.getElementById('productionChart'), {
                type: 'line',
                data: {
                    labels: agricultureData.productionTrends.years,
                    datasets: [
                        {
                            label: 'Vegetables (000 tons)',
                            data: agricultureData.productionTrends.vegetables,
                            borderColor: '#4caf50',
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            fill: true
                        },
                        {
                            label: 'Fruits (000 tons)',
                            data: agricultureData.productionTrends.fruits,
                            borderColor: '#ff9800',
                            backgroundColor: 'rgba(255, 152, 0, 0.1)',
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        });

        // إغلاق القائمة عند تغيير حجم الشاشة
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) {
                closeMenu();
            }
        });