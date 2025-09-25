function scrollToContent() {
    const firstSection = document.querySelector('.stats-section');
    if (firstSection) {
        firstSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}