/* ================================================================
   PROYECTO: PORTAFOLIO MIROSLAVA
   ARCHIVO: script.js
   DESCRIPCION: Funcionalidades globales para todas las paginas
   ================================================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    /* ================================================================
       1. MENU LATERAL (DRAWER)
       ================================================================ */
    
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('overlay');
    const menuBtn = document.getElementById('menu-btn');
    const closeDrawerBtn = document.getElementById('close-drawer');
    
    function openDrawer() {
        if (!drawer) return;
        drawer.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeDrawer() {
        if (!drawer) return;
        drawer.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openDrawer();
        });
    }
    
    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', closeDrawer);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeDrawer);
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) {
            closeDrawer();
        }
    });
    
    /* ================================================================
       2. SUBMENU EN DRAWER (MOVIL)
       ================================================================ */
    
    const drawerToggles = document.querySelectorAll('.drawer-toggle');
    
    drawerToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('active');
            
            var subMenu = this.nextElementSibling;
            if (subMenu && subMenu.classList.contains('drawer-sub-menu')) {
                subMenu.classList.toggle('open');
            }
        });
    });
    
    /* ================================================================
       3. CERRAR DRAWER AL HACER CLIC EN ENLACES
       ================================================================ */
    
    if (drawer) {
        var drawerLinks = drawer.querySelectorAll('.drawer-nav a:not(.drawer-toggle)');
        drawerLinks.forEach(function(link) {
            link.addEventListener('click', closeDrawer);
        });
    }
    
    /* ================================================================
       4. MODO OSCURO / CLARO
       ================================================================ */
    
    var themeToggle = document.getElementById('theme-toggle');
    var htmlElement = document.documentElement;
    
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        htmlElement.classList.add('dark');
    } else if (savedTheme === 'light') {
        htmlElement.classList.remove('dark');
    } else {
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            var isDark = htmlElement.classList.contains('dark');
            if (isDark) {
                htmlElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                htmlElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
    
    /* ================================================================
       5. NAVEGACION SUAVE (Smooth Scroll)
       ================================================================ */
    
    var smoothLinks = document.querySelectorAll('a[href^="#"]:not(.drawer-toggle)');
    
    smoothLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                var headerHeight = document.getElementById('header')?.offsetHeight || 64;
                var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    /* ================================================================
       6. HEADER SCROLL EFFECT
       ================================================================ */
    
    var header = document.getElementById('header');
    
    function handleHeaderScroll() {
        if (!header) return;
        var currentScrollY = window.pageYOffset;
        
        if (currentScrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        } else {
            header.style.boxShadow = 'none';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
        }
    }
    
    window.addEventListener('scroll', function() {
        requestAnimationFrame(handleHeaderScroll);
    });
    
    handleHeaderScroll();
    
    /* ================================================================
       7. FORMULARIO DE CONTACTO
       ================================================================ */
    
    var contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var name = document.getElementById('name')?.value?.trim();
            var email = document.getElementById('email')?.value?.trim();
            var message = document.getElementById('message')?.value?.trim();
            
            if (!name) {
                showFormError('Por favor, ingresa tu nombre.');
                return;
            }
            
            if (!email) {
                showFormError('Por favor, ingresa tu correo electronico.');
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormError('Por favor, ingresa un correo electronico valido.');
                return;
            }
            
            if (!message) {
                showFormError('Por favor, escribe tu mensaje.');
                return;
            }
            
            var submitBtn = contactForm.querySelector('button[type="submit"]');
            var originalText = submitBtn?.textContent || 'Enviar Mensaje';
            
            if (submitBtn) {
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
            }
            
            setTimeout(function() {
                showFormSuccess('Mensaje enviado con exito! Te contactare pronto.');
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
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showFormError(message) {
        var existingError = document.querySelector('.form-error-message');
        if (existingError) {
            existingError.remove();
        }
        
        var errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.style.cssText = 'padding: 12px 16px; background: #fee2e2; color: #991b1b; border-radius: 12px; font-size: 0.9rem; margin-bottom: 16px; border: 1px solid #fecaca;';
        errorDiv.textContent = '⚠️ ' + message;
        
        var form = document.getElementById('contactForm');
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
            setTimeout(function() {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, 5000);
        }
    }
    
    function showFormSuccess(message) {
        var existingSuccess = document.querySelector('.form-success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        var successDiv = document.createElement('div');
        successDiv.className = 'form-success-message';
        successDiv.style.cssText = 'padding: 12px 16px; background: #d1fae5; color: #065f46; border-radius: 12px; font-size: 0.9rem; margin-bottom: 16px; border: 1px solid #a7f3d0;';
        successDiv.textContent = '✅ ' + message;
        
        var form = document.getElementById('contactForm');
        if (form) {
            form.insertBefore(successDiv, form.firstChild);
            setTimeout(function() {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 5000);
        }
    }
    
    /* ================================================================
       8. CONSOLA DE BIENVENIDA
       ================================================================ */
    
    console.log('%c🎨 Miroslava - Disenadora Grafica', 'font-size: 20px; font-weight: bold; color: #6366f1;');
    console.log('%c✨ Diseno con pasion y proposito', 'font-size: 14px; color: #94a3b8;');
    console.log('%c📧 miroslava@diseno.com', 'font-size: 12px; color: #94a3b8;');
    
});

/* ================================================================
   CARRUSEL DE VIDEOS - PROYECTO 3
   ================================================================ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ---- CARRUSEL ----
    const track = document.getElementById('videoTrack');
    const prevBtn = document.getElementById('carrusel-prev');
    const nextBtn = document.getElementById('carrusel-next');
    const dots = document.querySelectorAll('.dot');
    
    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        const totalSlides = dots.length;
        let slidesPerView = 1;
        
        function updateCarousel() {
            const slideWidth = 100 / slidesPerView;
            const offset = currentIndex * slideWidth;
            track.style.transform = `translateX(-${offset}%)`;
            
            // Actualizar dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        function moveCarousel(direction) {
            if (direction === 'next') {
                currentIndex = Math.min(currentIndex + 1, totalSlides - 1);
            } else {
                currentIndex = Math.max(currentIndex - 1, 0);
            }
            updateCarousel();
        }
        
        prevBtn.addEventListener('click', function() {
            moveCarousel('prev');
        });
        
        nextBtn.addEventListener('click', function() {
            moveCarousel('next');
        });
        
        dots.forEach(function(dot, index) {
            dot.addEventListener('click', function() {
                currentIndex = index;
                updateCarousel();
            });
        });
        
        // Inicializar
        updateCarousel();
    }
    
    // ---- REPRODUCCION DE VIDEOS ----
    const playBtns = document.querySelectorAll('.video-play-btn');
    
    playBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const videoId = this.getAttribute('data-video');
            const video = document.getElementById(videoId);
            
            if (!video) return;
            
            // Pausar todos los otros videos
            document.querySelectorAll('.video-player').forEach(function(v) {
                if (v.id !== videoId && !v.paused) {
                    v.pause();
                    const otherBtn = document.querySelector(`.video-play-btn[data-video="${v.id}"]`);
                    if (otherBtn) {
                        otherBtn.classList.remove('playing');
                        otherBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }
            });
            
            if (video.paused) {
                video.play();
                this.classList.add('playing');
                this.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                video.pause();
                this.classList.remove('playing');
                this.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    });
    
    // Pausar videos cuando terminan
    document.querySelectorAll('.video-player').forEach(function(video) {
        video.addEventListener('ended', function() {
            const btn = document.querySelector(`.video-play-btn[data-video="${this.id}"]`);
            if (btn) {
                btn.classList.remove('playing');
                btn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    });
    
});