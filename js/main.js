document.addEventListener('DOMContentLoaded', () => {
    // Global 2-second Loading Screen
    const loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.className = 'fixed inset-0 bg-offwhite z-[9999] flex items-center justify-center';
    loader.innerHTML = `
        <div class="relative flex items-center justify-center w-32 h-32">
            <div class="absolute inset-0 rounded-full border-[3px] border-gray-200"></div>
            <div class="absolute inset-0 rounded-full border-[3px] border-[#7f2a4f] border-t-transparent animate-spin"></div>
            <img src="assets/images/logo.webp" alt="Loading..." class="h-5 md:h-6 w-auto z-10">
        </div>
    `;
    document.body.prepend(loader);
    
    setTimeout(() => {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => loader.remove()
        });
    }, 2000);

    // 1. Component Loaders
    const loadComponents = async () => {
        try {
            const navContainer = document.getElementById('navbar-container');
            if (navContainer) {
                const navResponse = await fetch('navbar.html?v=' + new Date().getTime());
                navContainer.innerHTML = await navResponse.text();

                // Add active state to current page in navbar
                const currentPath = window.location.pathname.split('/').pop() || 'index.html';
                document.querySelectorAll('#navbar-container a').forEach(link => {
                    const linkHref = link.getAttribute('href');
                    if (linkHref === currentPath) {
                        link.classList.add('text-accent');
                    }
                });
            }

            const footContainer = document.getElementById('footer-container');
            if (footContainer) {
                const footResponse = await fetch('footer.html?v=' + new Date().getTime());
                footContainer.innerHTML = await footResponse.text();
            }

            initMobileMenu();
            initAnimations();
        } catch (error) {
            console.error('Error loading components:', error);
            initAnimations(); // initialize anyway for page content
        }
    };

    // 2. Mobile Menu Logic
    const initMobileMenu = () => {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        // Move mobile menu to body to avoid backdrop-filter trapping it
        if (mobileMenu) {
            document.body.appendChild(mobileMenu);
        }

        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                const icon = menuBtn.querySelector('i');
                
                // Prevent background scrolling when menu is open
                if(!mobileMenu.classList.contains('hidden')) {
                    document.body.style.overflow = 'hidden';
                    if (icon) {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    }
                    // Basic reveal animation
                    gsap.fromTo('.mobile-menu-link', 
                        {y: 20, opacity: 0},
                        {y: 0, opacity: 1, stagger: 0.1, duration: 0.4}
                    );
                } else {
                    document.body.style.overflow = '';
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
            
            // Handle window resize to reset menu state on desktop
            window.addEventListener('resize', () => {
                if (window.innerWidth >= 1024 && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    document.body.style.overflow = '';
                    const icon = menuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
            
            // Mobile Pages Dropdown Toggle
            const pagesToggle = document.querySelector('.mobile-pages-toggle');
            const pagesDropdown = document.querySelector('.mobile-pages-dropdown');
            if (pagesToggle && pagesDropdown) {
                pagesToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    pagesDropdown.classList.toggle('hidden');
                    
                    const dropdownIcon = pagesToggle.querySelector('i');
                    if (dropdownIcon) {
                        if (pagesDropdown.classList.contains('hidden')) {
                            dropdownIcon.classList.remove('fa-angle-up');
                            dropdownIcon.classList.add('fa-angle-down');
                        } else {
                            dropdownIcon.classList.remove('fa-angle-down');
                            dropdownIcon.classList.add('fa-angle-up');
                        }
                    }
                });
            }
        }
    };



    // 4. GSAP & ScrollTrigger Initialization
    const initAnimations = () => {
        gsap.registerPlugin(ScrollTrigger);

        // Navbar Scroll
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('navbar-container');
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });

        // Hero Animations
        if (document.querySelector('.hero-section')) {
            const tl = gsap.timeline();
            tl.from('.hero-bg', { scale: 1.1, duration: 1.5, ease: 'power2.out' })
              .to('.reveal-text', { clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1, stagger: 0.2, ease: 'power3.out' }, '-=1')
              .from('.hero-btn', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, '-=0.5');

            // Parallax Hero
            gsap.to('.hero-bg', {
                yPercent: 20,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }

        // Marquee
        if (document.querySelector('.marquee-content')) {
            const marquee = document.querySelector('.marquee-content');
            const clone = marquee.innerHTML;
            marquee.innerHTML += clone; // duplicate for loop
            
            gsap.to('.marquee-content', {
                xPercent: -50,
                repeat: -1,
                duration: 20,
                ease: 'linear'
            });
        }

        // Image reveals
        gsap.utils.toArray('.reveal-image').forEach(img => {
            gsap.to(img, {
                clipPath: 'inset(0% 0 0 0)',
                duration: 1.2,
                ease: 'power3.inOut',
                scrollTrigger: {
                    trigger: img,
                    start: 'top 80%'
                }
            });
        });
        
        // Stagger Cards
        gsap.utils.toArray('.stagger-cards').forEach(container => {
            gsap.from(container.children, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%'
                }
            });
        });

        // Initialize AOS
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100
            });
        }
    };

    // 5. Countdown Timer Logic
    const initCountdowns = () => {
        const timers = document.querySelectorAll('.countdown-timer');
        timers.forEach(timer => {
            let daysEl = timer.querySelector('.days');
            let hoursEl = timer.querySelector('.hours');
            let minutesEl = timer.querySelector('.minutes');
            let secondsEl = timer.querySelector('.seconds');
            
            if(!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
            
            let days = parseInt(daysEl.textContent) || 0;
            let hours = parseInt(hoursEl.textContent) || 0;
            let minutes = parseInt(minutesEl.textContent) || 0;
            let seconds = parseInt(secondsEl.textContent) || 0;
            
            let totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
            
            setInterval(() => {
                if(totalSeconds <= 0) return;
                totalSeconds--;
                
                const d = Math.floor(totalSeconds / 86400);
                const h = Math.floor((totalSeconds % 86400) / 3600);
                const m = Math.floor((totalSeconds % 3600) / 60);
                const s = totalSeconds % 60;
                
                daysEl.textContent = d.toString().padStart(2, '0');
                hoursEl.textContent = h.toString().padStart(2, '0');
                minutesEl.textContent = m.toString().padStart(2, '0');
                secondsEl.textContent = s.toString().padStart(2, '0');
            }, 1000);
        });
    };

    // Initialize all
    loadComponents();
    initCountdowns();
});

// Handle browser back button (bfcache) to clear forms like footer subscription
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        const forms = document.querySelectorAll('form');
        forms.forEach(f => f.reset());
        const msg = document.getElementById('subscription-message');
        if (msg) msg.classList.add('hidden');
    }
});
