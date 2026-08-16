// 1. Dark Mode Toggle
const themeToggleBtn = document.getElementById('theme-toggle');

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        document.body.removeAttribute('data-theme');
        themeToggleBtn.textContent = '🌙 Dark Mode';
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️ Light Mode';
    }
});

// 2. 10-Picture Slideshow Logic
let slideIndex = 1;
showSlides(slideIndex);

// Auto play slides every 4 seconds
let slideInterval = setInterval(() => { plusSlides(1); }, 4000);

function plusSlides(n) {
    showSlides(slideIndex += n);
    resetTimer();
}

function currentSlide(n) {
    showSlides(slideIndex = n);
    resetTimer();
}

function resetTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => { plusSlides(1); }, 4000);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    slides[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].className += " active";
}

// 3. Form Submission
const cadetForm = document.getElementById('cadet-form');
const formStatus = document.getElementById('form-status');

cadetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    formStatus.textContent = `Salute! Application submitted for Cadet ${name}. HQ will contact you.`;
    formStatus.classList.remove('hidden');
    cadetForm.reset();
});


// Function to show locked message for recruitment buttons
function showLockedMessage(type) {
    if (type === 'Cadet Recruitment') {
        alert(`🔒 Cadet Recruitment is currently closed.\n\nApplications will open next semester.\nPlease check back later.`);
    } else if (type === 'Officers Application') {
        alert(`🔒 Officers applications are currently closed.\n\nOfficers applications will open next semester.\nPlease check back later.`);
    } else {
        alert(`🔒 Applications are currently closed.\n\nPlease check back later.`);
    }
}lockedmessage
