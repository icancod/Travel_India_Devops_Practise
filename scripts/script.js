// ==========================================================================
// TRAVEL INDIA — INTERACTIVE JAVASCRIPT
// ==========================================================================

// ===== DARK / LIGHT THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
}

const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });
}

// ===== MOBILE NAVIGATION MENU =====
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');

if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
        const isActive = hamburger.classList.toggle('active');
        mainNav.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isActive);
    });

    document.querySelectorAll('#main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mainNav.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('main-header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== SCROLL TO TOP BUTTON =====
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== HERO SEARCH WIDGET =====
function executeHeroSearch() {
    const destSelect = document.getElementById('search-destination');
    const selectedCategory = destSelect ? destSelect.value : 'all';

    // Find destination section
    const destSection = document.getElementById('destinations');
    if (destSection) {
        destSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Trigger tab filter matching destination
    const tab = document.querySelector(`.filter-tab[data-category="${selectedCategory}"]`) || 
                document.querySelector('.filter-tab[data-category="all"]');
    if (tab) {
        filterDestinations(selectedCategory, tab);
    }
}

// ===== DESTINATION CARD FILTERING (INDEX.HTML) =====
function filterDestinations(category, tabElement) {
    const tabs = document.querySelectorAll('.filter-tabs .filter-tab');
    tabs.forEach(t => t.classList.remove('active'));
    if (tabElement) {
        tabElement.classList.add('active');
    }

    const cards = document.querySelectorAll('#destinations-grid .card');
    cards.forEach(card => {
        const type = card.getAttribute('data-type');
        if (category === 'all' || type === category) {
            card.style.display = 'flex';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 30);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 250);
        }
    });
}

// ===== LIGHTBOX VIEWER =====
function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');

    if (lightbox && img && cap) {
        img.src = src;
        img.alt = caption || 'Explore India Travel Photograph';
        cap.textContent = caption || '';
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

const lightboxOverlay = document.getElementById('lightbox');
if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });
}

// ===== INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS =====
const fadeElements = document.querySelectorAll('.fade-in');
if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(el => fadeObserver.observe(el));
}

// ===== ANIMATED STATS COUNTER =====
function animateCounters() {
    const counters = document.querySelectorAll('[data-target]');
    counters.forEach(counter => {
        if (counter.dataset.animated) return;
        const target = parseInt(counter.dataset.target, 10);
        const duration = 1800;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * eased);
            counter.textContent = current.toLocaleString() + '+';

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.dataset.animated = 'true';
            }
        }
        requestAnimationFrame(update);
    });
}

const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    statsObserver.observe(statsSection);
}

// ===== FAQ ACCORDION (CONTACT.HTML) =====
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('active');

        // Close all others
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

        if (!isOpen) {
            item.classList.add('active');
        }
    });
});

// ===== NEWSLETTER FORM =====
function handleNewsletter(e) {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector('input');
    const btn = form.querySelector('button');
    const originalText = btn.textContent;

    btn.textContent = 'Subscribed ✓';
    btn.style.background = 'linear-gradient(135deg, #0A8F78, #046A58)';
    input.value = '';

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 3500);
}

// ===== CONTACT FORM =====
function handleContactForm(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('#contact-submit-btn') || form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Sending Inquiry...';
    btn.disabled = true;

    setTimeout(() => {
        btn.textContent = 'Inquiry Received! A Curator Will Contact You ✓';
        btn.style.background = 'linear-gradient(135deg, #0A8F78, #046A58)';
        form.reset();

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 4000);
    }, 1200);
}
