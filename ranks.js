// ========================================
// CLOSE RANKS & RETURN TO PREVIOUS TAB
// ========================================

document.getElementById('close-ranks').addEventListener('click', function() {
    // Try to close the current tab/window
    window.close();
    
    // Fallback if window.close() is blocked
    setTimeout(function() {
        if (!window.closed) {
            alert('Please close this tab manually to return to the main site.');
        }
    }, 200);
});

// ========================================
// DARK MODE TOGGLE FOR RANKS PAGE
// ========================================

const themeToggleRanks = document.getElementById('theme-toggle-ranks');

// Check for saved theme preference
if (localStorage.getItem('ranks-theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeToggleRanks.textContent = '☀️ Light Mode';
}

themeToggleRanks.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        document.body.removeAttribute('data-theme');
        themeToggleRanks.textContent = '🌙 Dark Mode';
        localStorage.setItem('ranks-theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleRanks.textContent = '☀️ Light Mode';
        localStorage.setItem('ranks-theme', 'dark');
    }
});

// ========================================
// KEYBOARD SHORTCUT: ESC to close ranks
// ========================================

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.getElementById('close-ranks').click();
    }
});

// ========================================
// ANIMATION: Staggered fade-in for rank cards
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.rank-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
});