// Global variables
let logoClickCount = 0;
let konamiSequence = [];
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
let particles = [];

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeNavigation();
    initializeScrollAnimations();
    initializeScrollToTop();
    initializeEasterEggs();
    initializeSmoothScrolling();
    animateOnScroll();
});

// Particle Animation System
function initializeParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particles
    function createParticles() {
        particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    // Animate particles
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Draw particle
            ctx.save();
            ctx.globalAlpha = particle.opacity;
            ctx.fillStyle = '#7c3aed';
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.save();
                    ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                    ctx.strokeStyle = '#f59e0b';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                    ctx.restore();
                }
            });
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    createParticles();
    animateParticles();
}

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.9)';
        }
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add fade-in animations to elements
    const fadeElements = document.querySelectorAll(
        '.domain-card, .showcase-item, .quote-card, .team-member, .section-header'
    );
    
    fadeElements.forEach((element, index) => {
        element.classList.add('fade-in');
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
}

// Scroll to top functionality
function initializeScrollToTop() {
    const scrollButton = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
    
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Easter eggs implementation
function initializeEasterEggs() {
    const logo = document.getElementById('logo');
    const secretModal = document.getElementById('secretModal');
    const closeSecretBtn = document.getElementById('closeSecret');
    
    // Logo click counter for pirate mode
    logo.addEventListener('click', () => {
        logoClickCount++;
        
        if (logoClickCount === 7) {
            activatePirateMode();
            logoClickCount = 0;
        }
        
        // Reset counter after 3 seconds if not reached
        setTimeout(() => {
            if (logoClickCount < 7) {
                logoClickCount = 0;
            }
        }, 3000);
    });
    
    // Konami code listener
    document.addEventListener('keydown', (e) => {
        konamiSequence.push(e.keyCode);
        
        // Keep only the last 10 key presses
        if (konamiSequence.length > 10) {
            konamiSequence.shift();
        }
        
        // Check if the sequence matches the Konami code
        if (arraysEqual(konamiSequence, konamiCode)) {
            activateKonamiSecret();
            konamiSequence = [];
        }
    });
    
    // Close secret modal
    closeSecretBtn.addEventListener('click', () => {
        secretModal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    secretModal.addEventListener('click', (e) => {
        if (e.target === secretModal) {
            secretModal.classList.remove('active');
        }
    });
}

// Activate pirate mode
function activatePirateMode() {
    document.body.classList.toggle('pirate-mode');
    
    // Add pirate-themed elements
    if (document.body.classList.contains('pirate-mode')) {
        // Change some text content temporarily
        const heroTitle = document.querySelector('.hero-title');
        const originalTitle = heroTitle.innerHTML;
        heroTitle.innerHTML = '<span class="highlight">Pirate Kalpaḥ</span><br>Sailing the Seas of Knowledge! ⚓';
        
        // Restore original title after 5 seconds
        setTimeout(() => {
            heroTitle.innerHTML = originalTitle;
        }, 5000);
        
        // Add pirate sound effect (if you want to add audio later)
        console.log('🏴‍☠️ Ahoy! Pirate mode activated! 🏴‍☠️');
        
        // Create floating pirate emojis
        createFloatingEmojis(['🏴‍☠️', '⚓', '🦜', '💰', '🗡️']);
        
        // Auto-deactivate after 30 seconds
        setTimeout(() => {
            document.body.classList.remove('pirate-mode');
        }, 30000);
    }
}

// Activate Konami secret
function activateKonamiSecret() {
    const secretModal = document.getElementById('secretModal');
    secretModal.classList.add('active');
    
    // Add special effects
    createStarBurst();
    
    // Change background temporarily
    document.body.style.background = 'linear-gradient(45deg, #1e293b, #7c3aed, #f59e0b)';
    document.body.style.backgroundSize = '400% 400%';
    document.body.style.animation = 'gradientShift 3s ease infinite';
    
    // Restore background after modal closes
    setTimeout(() => {
        document.body.style.background = '';
        document.body.style.backgroundSize = '';
        document.body.style.animation = '';
    }, 5000);
}

// Create floating emojis
function createFloatingEmojis(emojis) {
    emojis.forEach((emoji, index) => {
        setTimeout(() => {
            const floatingEmoji = document.createElement('div');
            floatingEmoji.textContent = emoji;
            floatingEmoji.style.cssText = `
                position: fixed;
                font-size: 3rem;
                z-index: 9999;
                pointer-events: none;
                left: ${Math.random() * window.innerWidth}px;
                top: ${window.innerHeight}px;
                animation: floatUp 4s ease-out forwards;
            `;
            
            document.body.appendChild(floatingEmoji);
            
            setTimeout(() => {
                floatingEmoji.remove();
            }, 4000);
        }, index * 500);
    });
}

// Create starburst effect
function createStarBurst() {
    const stars = ['✨', '⭐', '🌟', '💫'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.textContent = stars[Math.floor(Math.random() * stars.length)];
            star.style.cssText = `
                position: fixed;
                font-size: 2rem;
                z-index: 9999;
                pointer-events: none;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                animation: starBurst 2s ease-out forwards;
                animation-delay: ${i * 0.1}s;
            `;
            
            document.body.appendChild(star);
            
            setTimeout(() => {
                star.remove();
            }, 2000);
        }, i * 100);
    }
}

// Utility functions
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((val, i) => val === arr2[i]);
}

// Additional scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.domain-card, .showcase-item, .team-member');
    
    elements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes starBurst {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) translate(${Math.random() * 400 - 200}px, ${Math.random() * 400 - 200}px) scale(1);
            opacity: 0;
        }
    }
    
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`;
document.head.appendChild(style);

// Handle button clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
        // Add click animation
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
        
        // Handle specific button actions
        if (e.target.textContent === 'Explore Journey') {
            document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
        } else if (e.target.textContent === 'Join Community') {
            document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add subtle parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.cosmic-orb, .floating-elements');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Console Easter Egg
console.log(`
🌟 Welcome to VishvaKalpaḥ! 🌟

You found the console! Here are some secrets:
- Try the Konami Code: ↑↑↓↓←→←→BA
- Click the logo 7 times for a special theme
- We're always looking for curious developers!

Made with 💜 by the VishvaKalpa team
`);

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Your scroll handling code here
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);