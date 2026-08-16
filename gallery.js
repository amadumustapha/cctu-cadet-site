// ========================================
// CLOSE GALLERY & RETURN TO PREVIOUS TAB
// ========================================

document.getElementById('close-gallery').addEventListener('click', function() {
    // Try to close the current tab/window
    window.close();
    
    // If window.close() doesn't work (some browsers block it),
    // provide a fallback message
    setTimeout(function() {
        // If the window is still open after 200ms, window.close() failed
        // Show a message to the user
        if (!window.closed) {
            alert('Please close this tab manually to return to the main site.');
        }
    }, 200);
});

// ========================================
// DARK MODE TOGGLE FOR GALLERY
// ========================================

const themeToggleGallery = document.getElementById('theme-toggle-gallery');

// Check for saved theme preference
if (localStorage.getItem('gallery-theme') === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeToggleGallery.textContent = '☀️ Light Mode';
}

themeToggleGallery.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        document.body.removeAttribute('data-theme');
        themeToggleGallery.textContent = '🌙 Dark Mode';
        localStorage.setItem('gallery-theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleGallery.textContent = '☀️ Light Mode';
        localStorage.setItem('gallery-theme', 'dark');
    }
});

// ========================================
// KEYBOARD SHORTCUT: ESC to close gallery
// ========================================

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.getElementById('close-gallery').click();
    }
});