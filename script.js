document.addEventListener('DOMContentLoaded', () => {
    // 1. SCROLL REVEAL ANIMATION
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 2. STICKY NAV EFFECT
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. EMAILJS CONTACT FORM
    const emailServiceID = 'service_rmh2psh';
    const emailTemplateID = 'template_cuw7ser';
    const emailPublicKey = 'PT3X97Xi6fxWSBeZr';

    if (window.emailjs) {
        emailjs.init(emailPublicKey);
    }

    const contactForm = document.getElementById('contact-form');
    const contactFeedback = document.getElementById('contact-feedback');

    const showFeedback = (message, isError = false) => {
        if (!contactFeedback) return;
        contactFeedback.textContent = message;
        contactFeedback.className = `contact-feedback ${isError ? 'error' : 'success'}`;
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (!window.emailjs) {
                showFeedback('Email service is not ready yet. Please refresh the page.', true);
                return;
            }

            emailjs.sendForm(emailServiceID, emailTemplateID, contactForm)
                .then(() => {
                    showFeedback('Message sent successfully! Thank you for reaching out.');
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error('EmailJS error:', error);
                    showFeedback('Unable to send message right now. Please try again later.', true);
                });
        });
    }


    // 4. SMOOTH ANCHOR SCROLLING
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});