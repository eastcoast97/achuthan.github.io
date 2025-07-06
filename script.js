// Typing animation
const typingText = "I'm a Software Engineer who builds apps by day and tracks by night.";
const typingElement = document.getElementById('typing-animation');
let charIndex = 0;

function typeText() {
    if (charIndex < typingText.length) {
        typingElement.textContent = typingText.substring(0, charIndex + 1);
        charIndex++;
        
        // Variable speed based on punctuation
        const nextChar = typingText[charIndex];
        const delay = [',', '.', '!', '?'].includes(nextChar) ? 200 : 40;
        
        setTimeout(typeText, delay);
    } else {
        // Add typed class when animation is complete
        typingElement.classList.add('typed');
    }
}

// Analytics: Track scroll depth
let lastScrollDepth = 0;
function trackScrollDepth() {
    const scrollPercent = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
    const scrollDepthBreakpoints = [25, 50, 75, 90, 100];
    
    scrollDepthBreakpoints.forEach(breakpoint => {
        if (scrollPercent >= breakpoint && lastScrollDepth < breakpoint) {
            gtag('event', 'scroll_depth', {
                'depth': breakpoint,
                'page_percent': breakpoint + '%'
            });
        }
    });
    
    lastScrollDepth = scrollPercent;
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(trackScrollDepth);
});

// Start typing animation when page loads or section becomes visible
const aboutSection = document.getElementById('about');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            charIndex = 0;
            typeText();
            // Track section view
            gtag('event', 'section_view', {
                'section_name': 'about'
            });
        }
    });
}, { threshold: 0.5 });

observer.observe(aboutSection);

// Circuit background animations
function initCircuitAnimations() {
    document.querySelectorAll('.data-flow-particles').forEach(particlesContainer => {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'data-particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: #007bff;
                border-radius: 50%;
                box-shadow: 0 0 4px #007bff;
                opacity: ${Math.random() * 0.5 + 0.2};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particle-flow ${Math.random() * 3 + 2}s linear infinite;
            `;
            particlesContainer.appendChild(particle);
        }
    });
}

// Mouse parallax effect for timeline items
function addTimelineParallax() {
    const items = document.querySelectorAll('.timeline-content');
    
    items.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / centerX * 15;
            const moveY = (y - centerY) / centerY * 15;
            
            item.style.transform = `
                perspective(1000px)
                rotateY(${moveX}deg)
                rotateX(${-moveY}deg)
                translateZ(10px)
            `;
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
        });
    });
}

// Prevent any scrolling before page is fully loaded
document.documentElement.style.scrollBehavior = 'auto'; 
document.documentElement.style.overflowY = 'hidden';

// Fade in/out transitions
function initFadeEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                entry.target.classList.remove('fade-out');
                // Track section view
                if (entry.target.id) {
                    gtag('event', 'section_view', {
                        'section_name': entry.target.id
                    });
                }
            } else {
                entry.target.classList.add('fade-out');
                entry.target.classList.remove('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    document.querySelectorAll('.hero-section, #about, #Other, .journey-node').forEach(section => {
        section.classList.add('transition-element');
        observer.observe(section);
    });
}

// Analytics: Track external link clicks
function trackExternalLink(url, category) {
    gtag('event', 'external_link_click', {
        'link_url': url,
        'link_category': category
    });
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Track navigation click
            gtag('event', 'navigation_click', {
                'section_name': targetId.replace('#', '')
            });
            
            if (targetSection) {
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Track project and social link clicks
    document.querySelectorAll('.effect-btn, .social-knob, .dj-disc').forEach(link => {
        link.addEventListener('click', () => {
            const url = link.getAttribute('href');
            const category = link.classList.contains('effect-btn') ? 'project' :
                           link.classList.contains('social-knob') ? 'social' : 'music';
            trackExternalLink(url, category);
        });
    });
}

// Terminal contact form functionality
function initTerminal() {
    const terminal = document.getElementById('terminalOutput');
    const input = document.getElementById('terminalInput');
    const prompts = [
        'Enter your name: ',
        'Enter your email: ',
        'Enter your message: '
    ];
    let currentStep = 0;
    let formData = {};
    let isTyping = false;

    async function typeText(text, delay = 30) {
        isTyping = true;
        const line = document.createElement('div');
        line.className = 'line';
        terminal.appendChild(line);
        
        for (let char of text) {
            line.textContent += char;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        terminal.scrollTop = terminal.scrollHeight;
        isTyping = false;
    }

    async function addLine(text, withTyping = true) {
        if (withTyping) {
            await typeText(text);
        } else {
            const line = document.createElement('div');
            line.className = 'line';
            line.textContent = text;
            terminal.appendChild(line);
            terminal.scrollTop = terminal.scrollHeight;
        }
    }

    function validateInput(step, value) {
        switch(step) {
            case 0: return value.length >= 2;
            case 1: return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            case 2: return value.length >= 10;
            default: return false;
        }
    }

    async function processInput(value) {
        if (!isTyping) {
            if (validateInput(currentStep, value)) {
                formData[currentStep] = value;
                await addLine(`> ${value}`, false);
                currentStep++;
                
                // Track form step completion
                gtag('event', 'contact_form_step', {
                    'step_number': currentStep,
                    'step_name': ['name', 'email', 'message'][currentStep - 1]
                });
                
                if (currentStep < prompts.length) {
                    await typeText(prompts[currentStep]);
                } else {
                    await typeText('Processing your message...');
                    
                    try {
                        await emailjs.send(
                            'service_qk0fimk',
                            'template_325aerc',
                            {
                                to_email: 'achuthanram12@gmail.com',
                                to_name: 'Achuthan',
                                from_name: formData[0],
                                from_email: formData[1],
                                message: formData[2]
                            }
                        );
                        
                        // Track successful form submission
                        gtag('event', 'contact_form_submit', {
                            'status': 'success'
                        });
                        
                        await typeText('Message sent successfully!');
                        await new Promise(resolve => setTimeout(resolve, 500));
                        await typeText('Thank you for reaching out. I will be in touch soon!');
                        input.disabled = true;
                        
                        document.querySelectorAll('.light').forEach((light, i) => {
                            setTimeout(() => {
                                light.style.background = '#27c93f';
                                light.style.boxShadow = '0 0 10px #27c93f';
                            }, i * 200);
                        });
                    } catch (error) {
                        // Track form error
                        gtag('event', 'contact_form_error', {
                            'error_type': error.message
                        });
                        
                        await typeText('Error sending message. Please try again later.');
                        currentStep = 0;
                        formData = {};
                        await typeText(prompts[0]);
                    }
                }
            } else {
                // Track validation error
                gtag('event', 'contact_form_validation_error', {
                    'field': ['name', 'email', 'message'][currentStep]
                });
                
                await typeText('Invalid input. Please try again.');
                await typeText(prompts[currentStep]);
            }
        }
    }

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !input.disabled) {
            processInput(input.value.trim());
            input.value = '';
        }
    });

    async function initializeTerminal() {
        const lights = document.querySelectorAll('.light');
        lights.forEach((light, i) => {
            light.style.background = '#ffbd2e';
            light.style.animation = `blink ${(i + 1) * 0.5}s ease infinite`;
        });

        // Auto-focus the input when scrolled into view
        input.focus();

        await typeText('Initializing contact terminal...');
        await new Promise(resolve => setTimeout(resolve, 500));
        await typeText('Running system checks...');
        await new Promise(resolve => setTimeout(resolve, 400));
        await typeText('Establishing connection...');
        await new Promise(resolve => setTimeout(resolve, 600));
        await typeText('Welcome! Please provide your contact information.');
        await new Promise(resolve => setTimeout(resolve, 400));
        await typeText(prompts[0]);
    }

    initializeTerminal().then(() => {
        input.disabled = false;
        input.focus(); // Ensure focus is set after enabling
        // Track terminal initialization
        gtag('event', 'contact_form_start');
    });

    // Re-focus input when clicking anywhere in the terminal section
    document.querySelector('.terminal-section').addEventListener('click', () => {
        if (!input.disabled) {
            input.focus();
        }
    });
}

// Force scroll to top on page load/refresh
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

// Initialize everything on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    
    setTimeout(() => {
        document.documentElement.style.overflowY = '';
    }, 100);

    document.querySelector('.hero-text').style.opacity = '1';
    document.querySelectorAll('.circuit-background, .data-flow-particles').forEach(element => {
        element.style.opacity = '1';
    });
    
    initCircuitAnimations();
    initFadeEffects();
    initSmoothScroll();
    addTimelineParallax();
    
    // Track page load timing
    gtag('event', 'page_load_complete', {
        'load_time': performance.now()
    });
    
    const terminalSection = document.getElementById('contact');
    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initTerminal();
                terminalObserver.disconnect();
            }
        });
    }, {
        threshold: 0.2
    });
    
    terminalObserver.observe(terminalSection);
});

// DJ deck interaction
document.querySelectorAll('.dj-disc').forEach(disc => {
    disc.addEventListener('mouseenter', function() {
        this.style.animationDuration = '2s';
        // Track DJ deck interaction
        gtag('event', 'dj_deck_interaction', {
            'deck': this.dataset.project,
            'action': 'hover'
        });
    });
    
    disc.addEventListener('mouseleave', function() {
        this.style.animationDuration = '10s';
    });
});
