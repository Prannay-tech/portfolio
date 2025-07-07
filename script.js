// Harrison Jansma-inspired Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Hide any existing messages
            const formMessage = document.getElementById('form-message');
            formMessage.style.display = 'none';
            formMessage.className = 'form-message';
            
            // Simulate form submission (in a real implementation, you'd send this to a server)
            setTimeout(() => {
                // Create mailto link for now (you can integrate with EmailJS, Formspree, or similar services)
                const mailtoLink = `mailto:prannay.khushalani5@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
                
                // Show success message
                formMessage.textContent = 'Thank you for your message! I\'ll get back to you soon.';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
                
                // Optionally open email client
                // window.open(mailtoLink);
            }, 1000);
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add fade-in animation to cards when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.card, .project-card, .experience-item, .skill-category').forEach(el => {
        observer.observe(el);
    });

    // Simple navigation highlight
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Add hover effects to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        });
    });

    // Simple loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
    });

    // Add some personality with a console message
    console.log('👋 Thanks for checking out my portfolio! Feel free to reach out if you\'d like to collaborate.');
});

// Presentation toggle function
function togglePresentation(presentationId) {
    const presentation = document.getElementById(presentationId);
    if (presentation) {
        if (presentation.style.display === 'none' || presentation.style.display === '') {
            presentation.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
            presentation.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }
}

// Close presentation when clicking outside the content
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('presentation-container')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Close presentation with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const presentations = document.querySelectorAll('.presentation-container');
        presentations.forEach(presentation => {
            if (presentation.style.display === 'flex') {
                presentation.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});