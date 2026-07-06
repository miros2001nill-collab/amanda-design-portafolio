// ============================================ //
// MIROSLAVA - SCRIPT COMPLETO                  //
// ============================================ //

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================== //
    // 1. MENÚ LATERAL (DRAWER)                  //
    // ========================================== //
    
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('overlay');
    const menuBtn = document.getElementById('menu-btn');
    const closeDrawerBtn = document.getElementById('close-drawer');
    
    function openDrawer() {
        drawer.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeDrawer() {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (menuBtn) {
        menuBtn.addEventListener('click', openDrawer);
    }
    
    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', closeDrawer);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeDrawer);
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && drawer.classList.contains('active')) {
            closeDrawer();
        }
    });
    
    const drawerLinks = drawer ? drawer.querySelectorAll('a') : [];
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });
    
    
    // ========================================== //
    // 2. MODO OSCURO / CLARO                   //
    // ========================================== //
    
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        htmlElement.classList.add('dark');
    } else if (savedTheme === 'light') {
        htmlElement.classList.remove('dark');
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = htmlElement.classList.contains('dark');
            if (isDark) {
                htmlElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                htmlElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
    
    
    // ========================================== //
    // 3. CARRUSEL DE TESTIMONIOS               //
    // ========================================== //
    
    const carouselTrack = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    
    if (carouselTrack && prevBtn && nextBtn) {
        let currentScroll = 0;
        const cardWidth = 344;
        let maxScroll = 0;
        
        function updateMaxScroll() {
            const containerWidth = carouselTrack.parentElement.offsetWidth;
            const totalWidth = carouselTrack.scrollWidth;
            maxScroll = Math.max(0, totalWidth - containerWidth);
        }
        
        function scrollCarousel(direction) {
            updateMaxScroll();
            const scrollAmount = cardWidth * 2;
            
            if (direction === 'next') {
                currentScroll = Math.min(currentScroll + scrollAmount, maxScroll);
            } else {
                currentScroll = Math.max(currentScroll - scrollAmount, 0);
            }
            
            carouselTrack.scrollTo({
                left: currentScroll,
                behavior: 'smooth'
            });
        }
        
        prevBtn.addEventListener('click', function() {
            scrollCarousel('prev');
        });
        
        nextBtn.addEventListener('click', function() {
            scrollCarousel('next');
        });
        
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                updateMaxScroll();
                if (currentScroll > maxScroll) {
                    currentScroll = maxScroll;
                    carouselTrack.scrollTo({
                        left: currentScroll,
                        behavior: 'smooth'
                    });
                }
            }, 250);
        });
        
        setTimeout(updateMaxScroll, 100);
    }
    
    
    // ========================================== //
    // 4. NAVEGACIÓN SUAVE (Smooth Scroll)       //
    // ========================================== //
    
    const smoothLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.getElementById('header')?.offsetHeight || 64;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    // ========================================== //
    // 5. FORMULARIO DE CONTACTO                 //
    // ========================================== //
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name')?.value?.trim();
            const email = document.getElementById('email')?.value?.trim();
            const message = document.getElementById('message')?.value?.trim();
            
            if (!name) {
                showFormError('Por favor, ingresa tu nombre.');
                return;
            }
            
            if (!email) {
                showFormError('Por favor, ingresa tu correo electrónico.');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormError('Por favor, ingresa un correo electrónico válido.');
                return;
            }
            
            if (!message) {
                showFormError('Por favor, escribe tu mensaje.');
                return;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn?.textContent || 'Enviar Mensaje';
            
            if (submitBtn) {
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
            }
            
            setTimeout(function() {
                showFormSuccess('¡Mensaje enviado con éxito! Te contactaré pronto.');
                contactForm.reset();
                
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }
            }, 2000);
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showFormError(message) {
        const existingError = document.querySelector('.form-error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.style.cssText = `
            padding: 12px 16px;
            background: #fee2e2;
            color: #991b1b;
            border-radius: 12px;
            font-size: 0.9rem;
            margin-bottom: 16px;
            border: 1px solid #fecaca;
        `;
        errorDiv.textContent = '⚠️ ' + message;
        
        const form = document.getElementById('contactForm');
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, 5000);
        }
    }
    
    function showFormSuccess(message) {
        const existingSuccess = document.querySelector('.form-success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success-message';
        successDiv.style.cssText = `
            padding: 12px 16px;
            background: #d1fae5;
            color: #065f46;
            border-radius: 12px;
            font-size: 0.9rem;
            margin-bottom: 16px;
            border: 1px solid #a7f3d0;
        `;
        successDiv.textContent = '✅ ' + message;
        
        const form = document.getElementById('contactForm');
        if (form) {
            form.insertBefore(successDiv, form.firstChild);
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 5000);
        }
    }
    
    
    // ========================================== //
    // 6. HEADER SCROLL EFFECT                   //
    // ========================================== //
    
    const header = document.getElementById('header');
    let lastScrollY = window.pageYOffset;
    
    function handleHeaderScroll() {
        const currentScrollY = window.pageYOffset;
        
        if (currentScrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        } else {
            header.style.boxShadow = 'none';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
        }
        
        lastScrollY = currentScrollY;
    }
    
    window.addEventListener('scroll', function() {
        requestAnimationFrame(handleHeaderScroll);
    });
    
    handleHeaderScroll();
    
    
    // ========================================== //
    // 7. ANIMACIONES AL SCROLL (Intersection)   //
    // ========================================== //
    
    const animateElements = document.querySelectorAll(
        '.feature-card, .service-card, .featured-card, ' +
        '.featured-main, .marquee-content, .video-card, ' +
        '.testimonial-card, .contact-grid > *, .stat-item'
    );
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animateElements.forEach(function(element) {
            element.style.opacity = '0';
            observer.observe(element);
        });
        
        const heroStats = document.querySelectorAll('.stat-card');
        heroStats.forEach(function(stat) {
            stat.style.opacity = '0';
            observer.observe(stat);
        });
    } else {
        animateElements.forEach(function(element) {
            element.style.opacity = '1';
        });
    }
    
    
    // ========================================== //
    // 8. CONTADOR DE ESTADÍSTICAS               //
    // ========================================== //
    
    function animateCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(function(stat) {
            const text = stat.textContent;
            const number = parseInt(text);
            
            if (isNaN(number)) return;
            
            const isPercentage = text.includes('%');
            const isPlus = text.includes('+');
            
            let current = 0;
            const increment = Math.ceil(number / 40);
            const stepTime = Math.floor(1500 / 40);
            
            const timer = setInterval(function() {
                current += increment;
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                
                let displayText = current.toString();
                if (isPlus) displayText += '+';
                if (isPercentage) displayText += '%';
                stat.textContent = displayText;
            }, stepTime);
        });
    }
    
    const heroSection = document.getElementById('inicio');
    if (heroSection && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        counterObserver.observe(heroSection);
    }
    
    
    // ========================================== //
    // 9. PREVENCIÓN DE CLICS EN ENLACES VACÍOS  //
    // ========================================== //
    
    const emptyLinks = document.querySelectorAll('a[href="#"]');
    emptyLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
    
    
    // ========================================== //
    // 10. CARRUSEL DE VIDEOS                    //
    // ========================================== //
    
    function initVideoCarousel() {
        const section = document.getElementById('video-carousel');
        if (!section) return;
        
        const track = document.getElementById('videoTrack');
        const prevBtn = document.getElementById('videoPrev');
        const nextBtn = document.getElementById('videoNext');
        const dots = document.querySelectorAll('.video-dot');
        const slides = track ? track.querySelectorAll('.video-carousel-slide') : [];
        
        if (!track || !prevBtn || !nextBtn) return;
        
        let currentIndex = 0;
        let slidesPerView = 1;
        let totalSlides = slides.length;
        
        function getSlidesPerView() {
            if (window.innerWidth >= 768) {
                return 2;
            }
            return 1;
        }
        
        function updateCarousel() {
            slidesPerView = getSlidesPerView();
            const slideWidth = 100 / slidesPerView;
            const offset = currentIndex * slideWidth;
            track.style.transform = `translateX(-${offset}%)`;
            updateDots();
        }
        
        function updateDots() {
            const totalDots = Math.ceil(totalSlides / slidesPerView);
            const currentDot = Math.floor(currentIndex / slidesPerView);
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentDot);
                dot.style.display = index < totalDots ? 'block' : 'none';
            });
        }
        
        function moveCarousel(direction) {
            slidesPerView = getSlidesPerView();
            const maxIndex = Math.max(0, totalSlides - slidesPerView);
            
            if (direction === 'next') {
                currentIndex = Math.min(currentIndex + slidesPerView, maxIndex);
            } else {
                currentIndex = Math.max(currentIndex - slidesPerView, 0);
            }
            
            updateCarousel();
        }
        
        prevBtn.addEventListener('click', () => moveCarousel('prev'));
        nextBtn.addEventListener('click', () => moveCarousel('next'));
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                slidesPerView = getSlidesPerView();
                const targetIndex = index * slidesPerView;
                const maxIndex = Math.max(0, totalSlides - slidesPerView);
                currentIndex = Math.min(targetIndex, maxIndex);
                updateCarousel();
            });
        });
        
        // Control de reproducción de videos
        slides.forEach(slide => {
            const video = slide.querySelector('.video-player');
            const playBtn = slide.querySelector('.video-play-btn');
            
            if (video && playBtn) {
                playBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    toggleVideo(video, playBtn);
                });
                
                slide.addEventListener('click', function() {
                    toggleVideo(video, playBtn);
                });
                
                video.addEventListener('ended', function() {
                    playBtn.classList.remove('playing');
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                });
            }
        });
        
        function toggleVideo(video, playBtn) {
            if (video.paused) {
                // Pausar todos los otros videos
                document.querySelectorAll('.video-player').forEach(v => {
                    if (v !== video && !v.paused) {
                        v.pause();
                        const btn = v.closest('.video-card').querySelector('.video-play-btn');
                        if (btn) {
                            btn.classList.remove('playing');
                            btn.innerHTML = '<i class="fas fa-play"></i>';
                        }
                    }
                });
                
                video.play();
                playBtn.classList.add('playing');
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                video.pause();
                playBtn.classList.remove('playing');
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
        
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                const newSlidesPerView = getSlidesPerView();
                if (newSlidesPerView !== slidesPerView) {
                    slidesPerView = newSlidesPerView;
                    const maxIndex = Math.max(0, totalSlides - slidesPerView);
                    if (currentIndex > maxIndex) {
                        currentIndex = maxIndex;
                    }
                    updateCarousel();
                }
            }, 250);
        });
        
        setTimeout(() => {
            updateCarousel();
        }, 100);
    }
    
    // Inicializar carrusel de videos
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideoCarousel);
    } else {
        initVideoCarousel();
    }
    
    
    // ========================================== //
    // 11. CONSOLA DE BIENVENIDA                 //
    // ========================================== //
    
    console.log('%c🎨 Miroslava - Diseñadora Gráfica', 'font-size: 20px; font-weight: bold; color: #6366f1;');
    console.log('%c✨ Diseño con pasión y propósito', 'font-size: 14px; color: #94a3b8;');
    console.log('%c📧 miroslava@diseno.com', 'font-size: 12px; color: #94a3b8;');
    
});