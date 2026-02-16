document.addEventListener('DOMContentLoaded', () => {
    // ========== Smooth Scrolling ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const el = document.querySelector(targetId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ========== Cycling Typing Effect ==========
    const roles = [
        "iOS Developer",
        "Swift Engineer",
        "SwiftUI Enthusiast",
        "App Craftsman",
    ];
    const typingEl = document.getElementById('typing-text');
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;

    function type() {
        const role = roles[roleIdx];
        let speed;

        if (deleting) {
            typingEl.textContent = role.substring(0, charIdx - 1);
            charIdx--;
            speed = 40;
        } else {
            typingEl.textContent = role.substring(0, charIdx + 1);
            charIdx++;
            speed = 80;
        }

        if (!deleting && charIdx === role.length) {
            deleting = true;
            speed = 2000;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    if (typingEl) setTimeout(type, 600);

    // ========== Scroll Reveal with Stagger ==========
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Stagger children
                const children = entry.target.querySelectorAll('.stagger-child');
                children.forEach((child, i) => {
                    child.style.transitionDelay = `${i * 0.12}s`;
                    child.classList.add('active');
                });

                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));



    // ========== Navbar Scroll Effect ==========
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 100) {
            navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.06)';
        } else {
            navbar.style.borderBottomColor = 'transparent';
        }

        lastScroll = currentScroll;
    });

    // ========== Mobile Menu Toggle ==========
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
            menuBtn.classList.toggle('active');
        });
    }
});
