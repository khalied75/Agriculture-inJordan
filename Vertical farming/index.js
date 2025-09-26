// Interactive functions
        function showInfo(type) {
            const messages = {
                water: "Vertical farming uses recirculating water systems that reduce consumption by 95% compared to traditional agriculture.",
                space: "By utilizing vertical space, we can produce the same amount of food on 10% of the land area.",
                climate: "Controlled environments allow for perfect growing conditions 365 days a year.",
                organic: "No pesticides needed - closed systems prevent pest infiltration naturally.",
                urban: "Food grown where people live - reducing food miles and increasing freshness.",
                technology: "AI algorithms optimize light, nutrients, and temperature for each crop type."
            };
            
            alert(messages[type]);
        }

        // Add hover effects
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.background = 'linear-gradient(135deg, #f8fff8 0%, #e8f5e8 100%)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.background = 'white';
            });
        });

        // Scroll animations
        window.addEventListener('scroll', function() {
            const cards = document.querySelectorAll('.feature-card');
            cards.forEach(card => {
                const cardTop = card.getBoundingClientRect().top;
                if (cardTop < window.innerHeight - 100) {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }
            });
        });