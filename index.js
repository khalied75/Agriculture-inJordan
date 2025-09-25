let highlightsActive = false;
let messageTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    filterSystems('all');
    const systemCards = document.querySelectorAll('.system-card');
    systemCards.forEach(card => {
        card.classList.add('fade-in');
        setTimeout(() => card.classList.remove('fade-in'), 500);
    });
});

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function toggleHighlights() {
    highlightsActive = !highlightsActive;
    const statCards = document.querySelectorAll('.stat-card');

    statCards.forEach(card => {
        card.classList.toggle('card-highlight', highlightsActive);
        if (highlightsActive) {
            card.classList.add('fade-in');
            setTimeout(() => card.classList.remove('fade-in'), 450);
        }
    });

    showMessage(highlightsActive
        ? 'تم إبراز المؤشرات الأكثر تأثيراً هذا الشهر.'
        : 'تمت العودة إلى عرض المؤشرات بحالتها الأساسية.');
}

function filterSystems(filter) {
    const chips = document.querySelectorAll('.chip[data-filter]');
    chips.forEach(chip => {
        chip.classList.toggle('is-active', chip.dataset.filter === filter);
    });

    const applyFilter = (element) => {
        if (!element) return;
        const category = element.dataset.category;
        const match = filter === 'all' || category === filter;

        element.classList.toggle('is-hidden', !match);
        if (match) {
            element.classList.add('fade-in');
            setTimeout(() => element.classList.remove('fade-in'), 450);
        }
    };

    document.querySelectorAll('.stat-card').forEach(applyFilter);
    document.querySelectorAll('.system-card').forEach(applyFilter);

    const filterMessages = {
        all: 'يتم عرض كل الأنماط الزراعية والحلول الداعمة حالياً.',
        field: 'عرض خاص بالزراعة الحقلية في الأغوار والسهول.',
        protected: 'عرض الأنشطة داخل البيوت المحمية والمشاتل.',
        innovation: 'عرض التقنيات المبتكرة مثل الزراعة المائية والطاقة الشمسية.',
        desert: 'عرض المشروعات التوسعية في المناطق الصحراوية.'
    };

    showMessage(filterMessages[filter] || 'تم تحديث العرض حسب اختيارك.');
}

function highlightCard(button) {
    const card = button.closest('.system-card');
    if (!card) return;

    const isHighlighted = card.classList.toggle('highlighted');
    showMessage(isHighlighted
        ? 'تمت إضافة هذا الحل إلى قائمة المتابعة.'
        : 'تمت إزالة هذا الحل من قائمة المتابعة.');
}

function simulateAlert() {
    const localStockDays = Math.floor(Math.random() * 6) + 5; // 5-10 أيام
    const coverage = Math.floor(Math.random() * 20) + 70; // 70-89%
    const message = 'المخزون المحلي يغطي ' + coverage + '% من الطلب خلال ' + localStockDays + ' أيام قادمة.';
    showMessage(message);
}

function showMessage(text) {
    const panel = document.getElementById('message-panel');
    if (!panel) return;

    panel.textContent = text;
    panel.classList.add('visible');

    if (messageTimer) {
        clearTimeout(messageTimer);
    }

    messageTimer = setTimeout(() => {
        panel.classList.remove('visible');
    }, 4200);
}
