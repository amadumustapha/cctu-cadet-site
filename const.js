// ========================================
// CLOSE CONSTITUTION & RETURN TO PREVIOUS TAB
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Get the close button
    const closeBtn = document.getElementById('close-constitution');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            // Try to close the current tab/window
            window.close();
            
            // Fallback if window.close() is blocked
            setTimeout(function() {
                if (!window.closed) {
                    alert('Please close this tab manually to return to the main site.');
                }
            }, 200);
        });
    }

    // ========================================
    // DARK MODE TOGGLE FOR CONSTITUTION PAGE
    // ========================================

    const themeToggle = document.getElementById('theme-toggle-constitution');
    
    if (themeToggle) {
        // Check for saved theme preference
        if (localStorage.getItem('constitution-theme') === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️ Light Mode';
        }

        themeToggle.addEventListener('click', function() {
            const currentTheme = document.body.getAttribute('data-theme');
            
            if (currentTheme === 'dark') {
                document.body.removeAttribute('data-theme');
                themeToggle.textContent = '🌙 Dark Mode';
                localStorage.setItem('constitution-theme', 'light');
            } else {
                document.body.setAttribute('data-theme', 'dark');
                themeToggle.textContent = '☀️ Light Mode';
                localStorage.setItem('constitution-theme', 'dark');
            }
        });
    }

    // ========================================
    // KEYBOARD SHORTCUT: ESC to close constitution
    // ========================================

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const closeBtn = document.getElementById('close-constitution');
            if (closeBtn) {
                closeBtn.click();
            }
        }
    });

    // ========================================
    // ANIMATION: Staggered fade-in for sections
    // ========================================

    const sections = document.querySelectorAll('.constitution-section');
    
    sections.forEach(function(section, index) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(function() {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 100 + (index * 80));
    });
});