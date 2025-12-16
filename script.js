// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            navLinks.classList.remove('active');
        }
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.about-card, .dept-card, .section-header').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add CSS for animation
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Google Forms URL - Submit to formResponse endpoint
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdSJGnsjl9TzIzwqIw80nvurEIfRFLzhXyQc_s1ngTNAJy58g/formResponse";

// Form submission (STORE REQUESTS + GOOGLE FORMS)
const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    data.createdAt = new Date().toLocaleString('ar-SA');
    data.status = "Pending";

    // Save to localStorage
    const requests = JSON.parse(localStorage.getItem("joinRequests")) || [];
    requests.push(data);
    localStorage.setItem("joinRequests", JSON.stringify(requests));

    // Submit to Google Forms (in background)
    submitToGoogleForms(data);

    // UI feedback
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ تم إرسال الطلب بنجاح!';
    btn.style.background = 'linear-gradient(135deg, #43a047, #66bb6a)';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        contactForm.reset();
    }, 3000);
});

// Function to submit data to Google Forms
function submitToGoogleForms(data) {
    // Create a hidden iframe for form submission
    const iframe = document.createElement('iframe');
    iframe.name = 'hidden_iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Create a form to submit to Google Forms
    const googleForm = document.createElement('form');
    googleForm.method = 'POST';
    googleForm.action = GOOGLE_FORM_ACTION_URL;
    googleForm.target = 'hidden_iframe';

    // Map your form fields to Google Form entry IDs
    const fieldMapping = {
        'entry.128547825': data.name,       // Full Name (الاسم الرباعي)
        'entry.1925269306': data.email,     // Email (الايميل الجامعي)
        'entry.520145743': data.phone,      // Phone (رقم الهاتف)
        'entry.168880819': data.department, // Department (القسم)
        'entry.1641401705': data.message    // Message (الرسالة)
    };

    // Add hidden inputs for each field
    for (const [entryId, value] of Object.entries(fieldMapping)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = entryId;
        input.value = value || '';
        googleForm.appendChild(input);
    }

    document.body.appendChild(googleForm);
    googleForm.submit();

    // Cleanup after submission
    setTimeout(() => {
        document.body.removeChild(googleForm);
        document.body.removeChild(iframe);
    }, 1000);
}

// Department card hover effects
document.querySelectorAll('.dept-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax effect for orbs
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const orbs = document.querySelectorAll('.orb');
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.05;
                orb.style.transform = `translateY(${scrolled * speed}px)`;
            });
            ticking = false;
        });
        ticking = true;
    }
});

console.log('🎓 TechNet Website Loaded Successfully!');
