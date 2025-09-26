 // Interactive functions
        function showDiseaseInfo(type) {
            const messages = {
                fungal: "🦠 Fungal Diseases: Caused by pathogens like mildew and rust. Treat with fungicides and improve air circulation.",
                bacterial: "🧫 Bacterial Infections: Spread through water and tools. Use copper-based bactericides and remove infected plants.",
                viral: "🔬 Viral Diseases: Often insect-transmitted. Focus on pest control and remove infected plants immediately.",
                pests: "🐜 Pest-Related: Insects create entry points for diseases. Implement integrated pest management.",
                nutritional: "💊 Nutritional Disorders: Soil testing and balanced fertilization prevent deficiencies.",
                environmental: "🌡️ Environmental Stress: Proper watering and shading reduce abiotic stressors."
            };
            
            alert(messages[type]);
        }

        // Add hover effects
        document.querySelectorAll('.disease-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.background = 'linear-gradient(135deg, #fff0f0 0%, #ffe0e0 100%)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.background = 'white';
            });
        });

        // Emergency alert animation
        const alert = document.querySelector('.emergency-alert');
        setInterval(() => {
            alert.style.transform = alert.style.transform === 'scale(1.02)' ? 'scale(1)' : 'scale(1.02)';
        }, 1000)