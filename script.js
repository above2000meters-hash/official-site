document.addEventListener('DOMContentLoaded', () => {

    // ====== 1. PAGE LOADER ======
    const loader = document.getElementById('loader');
    const heroImg = document.querySelector('.hero-img');

    const hideLoader = () => {
        loader.classList.add('hidden');
        if (heroImg) heroImg.classList.add('loaded');
    };

    if (document.readyState === 'complete') {
        setTimeout(hideLoader, 800);
    } else {
        window.addEventListener('load', () => setTimeout(hideLoader, 800));
    }


    // ====== 2. CUSTOM CURSOR ======
    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursor-dot');

    if (cursor && cursorDot && window.innerWidth > 768) {
        let cx = 0, cy = 0;
        let dx = 0, dy = 0;

        document.addEventListener('mousemove', (e) => {
            dx = e.clientX; dy = e.clientY;
            cursorDot.style.left = dx + 'px';
            cursorDot.style.top  = dy + 'px';
        });

        const animateCursor = () => {
            cx += (dx - cx) * 0.12;
            cy += (dy - cy) * 0.12;
            cursor.style.left = cx + 'px';
            cursor.style.top  = cy + 'px';
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        document.querySelectorAll('a, button, .product-card, .profile-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
    }


    // ====== 3. STICKY NAV ======
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
            hamburger.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('nav-open') ? 'hidden' : '';
        });

        // Close on nav link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-open');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }


    // ====== 4. SCROLL REVEAL ======
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));


    // ====== 5. SMOOTH SCROLLING ======
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });


    // ====== 6. EMAILJS CONTACT FORM ======
    const emailServiceID  = 'service_rmh2psh';
    const emailTemplateID = 'template_cuw7ser';
    const emailPublicKey  = 'PT3X97Xi6fxWSBeZr';

    if (window.emailjs) emailjs.init(emailPublicKey);

    const contactForm     = document.getElementById('contact-form');
    const contactFeedback = document.getElementById('contact-feedback');
    const captchaLabel    = document.getElementById('captcha-label');
    const captchaInput    = document.getElementById('captcha-answer');

    const captchaQuestions = [
        { question: 'Human check: What is 1 + 1?', answer: '2' },
        { question: 'Human check: What is 2 + 3?', answer: '5' },
        { question: 'Human check: What is 4 - 1?', answer: '3' },
        { question: 'Human check: What is 3 + 2?', answer: '5' },
        { question: 'Human check: What is 2 + 4?', answer: '6' },
    ];
    let currentCaptchaAnswer = '2';

    const setCaptchaQuestion = () => {
        const q = captchaQuestions[Math.floor(Math.random() * captchaQuestions.length)];
        currentCaptchaAnswer = q.answer;
        if (captchaLabel) captchaLabel.textContent = q.question;
    };

    const showFeedback = (msg, isError = false) => {
        if (!contactFeedback) return;
        contactFeedback.textContent = msg;
        contactFeedback.className = `contact-feedback ${isError ? 'error' : 'success'}`;
    };

    setCaptchaQuestion();

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const userCaptcha = captchaInput ? captchaInput.value.trim() : '';
            if (userCaptcha !== currentCaptchaAnswer) {
                showFeedback('Please answer the captcha correctly before sending.', true);
                captchaInput?.focus();
                setCaptchaQuestion();
                if (captchaInput) captchaInput.value = '';
                return;
            }

            if (!window.emailjs) {
                showFeedback('Email service not ready. Please refresh and try again.', true);
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const btnText   = submitBtn.querySelector('.btn-text');
            if (btnText) btnText.textContent = 'Sending…';
            submitBtn.disabled = true;

            emailjs.sendForm(emailServiceID, emailTemplateID, contactForm)
                .then(() => {
                    showFeedback('Message sent successfully! We\'ll get back to you soon.');
                    contactForm.reset();
                    setCaptchaQuestion();
                })
                .catch((err) => {
                    console.error('EmailJS error:', err);
                    showFeedback('Unable to send right now. Please try again later.', true);
                })
                .finally(() => {
                    if (btnText) btnText.textContent = 'Send Message';
                    submitBtn.disabled = false;
                });
        });
    }


    // ====== 7. PARALLAX HERO ======
    const heroBg = document.querySelector('.hero-img');
    if (heroBg && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                heroBg.style.transform = `scale(1) translateY(${y * 0.25}px)`;
            }
        }, { passive: true });
    }

});