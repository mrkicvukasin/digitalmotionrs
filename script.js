document.addEventListener('DOMContentLoaded', () => {
    // Sticky Header
    const header = document.getElementById('main-header');
    const headerHeight = header.offsetHeight;

    window.addEventListener('scroll', () => {
        if (window.scrollY > headerHeight / 2) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Hamburger Menu
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNav = document.getElementById('main-nav');

    if (hamburgerMenu && mainNav) {
        hamburgerMenu.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            hamburgerMenu.classList.toggle('open');
            const isExpanded = hamburgerMenu.getAttribute('aria-expanded') === 'true' || false;
            hamburgerMenu.setAttribute('aria-expanded', !isExpanded);
        });

        // Close mobile nav when a link is clicked
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    hamburgerMenu.classList.remove('open');
                    hamburgerMenu.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Smooth Scrolling & Active Link Highlighting
    const navLinks = document.querySelectorAll('#main-nav a');
    const sections = document.querySelectorAll('main section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                let offset = header.classList.contains('sticky') ? header.offsetHeight : 0;
                // Special handling for hero section to scroll to very top
                if (targetId === 'hero') {
                    offset = 0; 
                }
                window.scrollTo({
                    top: targetSection.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active link highlighting on scroll
    function changeActiveLink() {
        let index = sections.length;
        while(--index && window.scrollY + headerHeight * 1.5 < sections[index].offsetTop) {}
        navLinks.forEach((link) => link.classList.remove('active'));
        if (navLinks[index]) {
            navLinks[index].classList.add('active');
        }
    }
    changeActiveLink(); // Initial call
    window.addEventListener('scroll', changeActiveLink);

    // Scroll-triggered Animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of element visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target); 
            }
            // Optional: remove class if element scrolls out of view (for re-animation)
            // else {
            //     entry.target.classList.remove('is-visible');
            // }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Update current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Pulsating Digital Network Animation for Hero Section ---
    const canvas = document.getElementById('network-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let nodes = [];
        const NODE_COUNT = 18;
        const PULSE_SPEED = 1.5;

        function resize() {
            // Use window dimensions for width, and hero section height for height
            width = window.innerWidth;
            const heroSection = document.getElementById('hero');
            height = heroSection ? heroSection.offsetHeight : window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }

        function randomNode() {
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                r: 2 + Math.random() * 2,
                baseR: 2 + Math.random() * 2,
                phase: Math.random() * Math.PI * 2
            };
        }

        function createNodes() {
            nodes = [];
            for (let i = 0; i < NODE_COUNT; i++) {
                nodes.push(randomNode());
            }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            // Draw lines
            ctx.save();
            ctx.globalAlpha = 0.25;
            ctx.strokeStyle = '#64FFDA';
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 180) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.restore();

            // Draw nodes (pulsating)
            const now = performance.now() / 1000;
            for (let node of nodes) {
                const pulse = Math.sin(now * PULSE_SPEED + node.phase) * 1.2;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.baseR + pulse, 0, Math.PI * 2);
                ctx.fillStyle = '#64FFDA';
                ctx.globalAlpha = 0.7;
                ctx.shadowColor = '#64FFDA';
                ctx.shadowBlur = 8 + pulse * 2;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            ctx.globalAlpha = 1;
            requestAnimationFrame(draw);
        }

        function initNetwork() {
            resize();
            createNodes();
            draw();
        }

        // Debounce resize to avoid rapid redraws on mobile
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resize();
                createNodes();
            }, 150);
        });

        initNetwork();
    }
});
