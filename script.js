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

// Start typing animation when page loads or section becomes visible
const aboutSection = document.getElementById('about');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            charIndex = 0;
            typeText();
        }
    });
}, { threshold: 0.5 });

observer.observe(aboutSection);

// Circuit background animations
function initCircuitAnimations() {
    // Find all sections with data-flow-particles
    document.querySelectorAll('.data-flow-particles').forEach(particlesContainer => {
        // Create data flow particles for each container
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
            } else {
                entry.target.classList.add('fade-out');
                entry.target.classList.remove('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Observe all major sections
    document.querySelectorAll('.hero-section, #about, #Other, .journey-node').forEach(section => {
        section.classList.add('transition-element');
        observer.observe(section);
    });
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
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
                
                if (currentStep < prompts.length) {
                    await typeText(prompts[currentStep]);
                } else {
                    await typeText('Processing your message...');
                    
                    // Prepare email parameters
                    const emailParams = {
                        to_email: 'achuthanram97@gmail.com',
                        from_name: formData[0],
                        from_email: formData[1],
                        message: formData[2]
                    };

                    try {
                        // Send email using EmailJS
                        await emailjs.send(
                            'service_1wetp6c', // EmailJS service ID
                            'template_325aerc', // EmailJS template ID
                            {
                                to_email: 'achuthanram97@gmail.com',
                                to_name: 'Achuthan',
                                from_name: formData[0],
                                email: formData[1],
                                message: formData[2]
                            }
                        );
                        
                        await typeText('Message sent successfully!');
                        await new Promise(resolve => setTimeout(resolve, 500));
                        await typeText('Thank you for reaching out. I will be in touch soon!');
                        input.disabled = true;
                        
                        // Success animation
                        document.querySelectorAll('.light').forEach((light, i) => {
                            setTimeout(() => {
                                light.style.background = '#27c93f';
                                light.style.boxShadow = '0 0 10px #27c93f';
                            }, i * 200);
                        });
                    } catch (error) {
                        await typeText('Error sending message. Please try again later.');
                        // Reset form
                        currentStep = 0;
                        formData = {};
                        await typeText(prompts[0]);
                    }
                }
            } else {
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

    // Initialize with animated welcome message
    async function initializeTerminal() {
        // Start loading animation
        const lights = document.querySelectorAll('.light');
        lights.forEach((light, i) => {
            light.style.background = '#ffbd2e';
            light.style.animation = `blink ${(i + 1) * 0.5}s ease infinite`;
        });

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

    // Start the terminal and enable input after initialization
    initializeTerminal().then(() => {
        input.disabled = false;
    });
}

// Force scroll to top on page load/refresh
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

// Initialize everything on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Ensure we're at the top
    window.scrollTo(0, 0);
    
    // Re-enable scrolling after a short delay
    setTimeout(() => {
        document.documentElement.style.overflowY = '';
    }, 100);

    // Show initial content and initialize animations
    document.querySelector('.hero-text').style.opacity = '1';
    document.querySelectorAll('.circuit-background, .data-flow-particles').forEach(element => {
        element.style.opacity = '1';
    });
    
    // Initialize all animations
    initCircuitAnimations();
    initFadeEffects();
    initSmoothScroll();
    
    // Initialize timeline
    addTimelineParallax();
    
    // Initialize terminal when scrolled into view
    const terminalSection = document.getElementById('contact');
    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initTerminal();
                terminalObserver.disconnect(); // Only initialize once
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
    });
    
    disc.addEventListener('mouseleave', function() {
        this.style.animationDuration = '10s';
    });
});
