// ====================================
// PORTFOLIO V2.0 - SCRIPT.JS
// ====================================
// ✅ Mode clair/sombre avec localStorage
// ✅ Lottie lazy-loading
// ✅ Skills animation au scroll
// ✅ Smooth navigation
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    // ====================================
    // GESTION DU THÈME CLAIR/SOMBRE
    // ====================================
    
    const themeCheckbox = document.getElementById('theme-checkbox');
    const htmlElement = document.documentElement;
    
    // Récupérer le thème sauvegardé (par défaut: dark)
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    themeCheckbox.checked = savedTheme === 'light';
    
    // Écouter le changement de thème
    themeCheckbox.addEventListener('change', () => {
        const newTheme = themeCheckbox.checked ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        
        // Animation de transition douce
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });

    // ====================================
    // BARRE DE PROGRESSION DU SCROLL
    // ====================================
    
    const progressBar = document.querySelector('.progress-bar');
    const progressPercent = document.querySelector('.progress-percent');
    
    function updateScrollProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
        progressPercent.textContent = Math.round(Math.min(scrollPercent, 100)) + '%';
    }
    
    // ====================================
    // NAVIGATION ACTIVE & SMOOTH SCROLL
    // ====================================
    
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    function highlightActiveSection() {
        let currentSection = '';
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    // Smooth scroll pour les liens de navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ====================================
    // LOTTIE ANIMATIONS (LAZY-LOAD)
    // ====================================
    
    const lottieContainers = document.querySelectorAll('.lottie-container[data-lottie]');
    const loadedLotties = new Set();
    
    function loadLottie(container) {
        const lottiePath = container.getAttribute('data-lottie');
        const containerId = container.id;
        
        // Éviter de charger plusieurs fois
        if (loadedLotties.has(containerId)) return;
        loadedLotties.add(containerId);
        
        // Ajouter classe de chargement
        container.classList.add('lottie-loading');
        
        // Note: Utilise lottie-web depuis le CDN
        try {
            const animation = lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: lottiePath
            });
            
            animation.addEventListener('DOMLoaded', () => {
                container.classList.remove('lottie-loading');
                container.classList.add('loaded');
            });
            
            // Fallback en cas d'erreur
            animation.addEventListener('error', () => {
                container.classList.remove('lottie-loading');
                container.style.display = 'none';
                console.warn(`Lottie animation non trouvée: ${lottiePath}`);
            });
        } catch (error) {
            container.classList.remove('lottie-loading');
            container.style.display = 'none';
            console.warn('Erreur lors du chargement de Lottie:', error);
        }
    }
    
    // Observer pour lazy-load Lottie
    const lottieObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadLottie(entry.target);
                lottieObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '100px'
    });
    
    lottieContainers.forEach(container => {
        lottieObserver.observe(container);
    });
    
    // ====================================
    // ANIMATION DES BARRES DE COMPÉTENCES
    // ====================================

    const skillItems = document.querySelectorAll('.skill-item');
    const animatedSkills = new Map();

    function animateSkillBar(skillItem) {
        if (animatedSkills.has(skillItem)) return;
        animatedSkills.set(skillItem, true);
        
        const percent = parseInt(skillItem.getAttribute('data-percent')) || 0;
        const progressBar = skillItem.querySelector('.skill-progress');
        const percentText = skillItem.querySelector('.skill-percent');
        
        if (!progressBar || !percentText) return;
        
        progressBar.style.width = '0%';
        percentText.textContent = '0%';
        
        setTimeout(() => {
            progressBar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            progressBar.style.width = percent + '%';
            
            let currentPercent = 0;
            const duration = 1500;
            const fps = 60;
            const totalFrames = (duration / 1000) * fps;
            const increment = percent / totalFrames;
            
            const animateCounter = () => {
                currentPercent += increment;
                
                if (currentPercent >= percent) {
                    percentText.textContent = percent + '%';
                    return;
                }
                
                percentText.textContent = Math.round(currentPercent) + '%';
                requestAnimationFrame(animateCounter);
            };
            
            requestAnimationFrame(animateCounter);
        }, 100);
    }

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    animateSkillBar(entry.target);
                }, index * 100);
                
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    skillItems.forEach(item => {
        skillObserver.observe(item);
    });
    
    // ====================================
    // ANIMATION DES SECTIONS AU SCROLL
    // ====================================
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // ====================================
    // ANIMATION DE LA TIMELINE
    // ====================================
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150);
            }
        });
    }, {
        threshold: 0.2
    });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        item.style.transition = 'all 0.6s ease';
        timelineObserver.observe(item);
    });
    
    // ====================================
    // EFFET TYPING SUR LE TITRE PRINCIPAL
    // ====================================
    
    const mainTitle = document.querySelector('.accueil-title');
    
    if (mainTitle) {
        const originalText = mainTitle.textContent;
        mainTitle.textContent = '';
        let charIndex = 0;
        
        function typeWriter() {
            if (charIndex < originalText.length) {
                mainTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 80);
            }
        }
        
        setTimeout(typeWriter, 300);
    }
    
    // ====================================
    // BOUTON CTA SMOOTH SCROLL
    // ====================================
    
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const contactSection = document.querySelector('#contact');
            
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // ====================================
    // VALIDATION DU FORMULAIRE
    // ====================================
    
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validation
            if (name === '' || email === '' || subject === '' || message === '') {
                e.preventDefault();
                alert('Veuillez remplir tous les champs du formulaire.');
                return false;
            }
            
            // Validation email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                e.preventDefault();
                alert('Veuillez entrer une adresse email valide.');
                return false;
            }
            
            // Message de confirmation
            console.log('Formulaire valide, envoi en cours...');
        });
        
        // Animation des champs au focus
        const formInputs = contactForm.querySelectorAll('input, textarea');
        
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.01)';
                this.parentElement.style.transition = 'transform 0.2s ease';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });
    }
    
    // ====================================
    // EFFET HOVER SUR LES ICÔNES
    // ====================================
    
    const icons = document.querySelectorAll('.card-icon, .certification-icon');
    
    icons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'rotate(10deg) scale(1.1)';
            this.style.transition = 'all 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'rotate(0deg) scale(1)';
        });
    });
    
    // ====================================
    // GESTION DES IMAGES AVEC FALLBACK
    // ====================================
    
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // L'attribut onerror dans le HTML gère déjà les fallbacks
            console.warn('Image non trouvée:', this.src);
        });
    });
    
    // ====================================
    // GESTION DU SCROLL (OPTIMISÉ)
    // ====================================
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrollProgress();
                highlightActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // ====================================
    // INITIALISATION AU CHARGEMENT
    // ====================================
    
    updateScrollProgress();
    highlightActiveSection();
    
    // Animation de la photo (pulse)
    const photoPlaceholder = document.querySelector('.photo-placeholder');
    
    if (photoPlaceholder) {
        setInterval(() => {
            photoPlaceholder.style.transform = 'scale(1.03)';
            setTimeout(() => {
                photoPlaceholder.style.transform = 'scale(1)';
            }, 500);
        }, 3000);
    }
    
    // ====================================
    // GESTION DES LIENS PROJETS
    // ====================================
    
    const projetLinks = document.querySelectorAll('.projet-link');
    
    projetLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Si le lien est "#", empêcher la navigation
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                alert('Ce projet n\'a pas encore de page de détail. Modifiez le lien dans le HTML.');
            }
        });
    });
    
    // ====================================
    // DÉTECTION DU SCROLL VERS LE BAS/HAUT
    // ====================================
    
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 300) {
            // Scroll vers le bas
            navbar.style.opacity = '0.7';
        } else {
            // Scroll vers le haut
            navbar.style.opacity = '1';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
    
    // ====================================
    // LOGS DE DÉBOGAGE
    // ====================================
    
    console.log('🚀 Portfolio V2.0 chargé avec succès!');
    console.log('📊 Sections:', sections.length);
    console.log('🎨 Thème actuel:', htmlElement.getAttribute('data-theme'));
    console.log('💻 Compétences:', skillItems.length);
    console.log('📁 Projets:', document.querySelectorAll('.projet-card').length);
    
    // ====================================
    // EASTER EGG (optionnel)
    // ====================================
    
    let konami = [];
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    
    document.addEventListener('keydown', (e) => {
        konami.push(e.keyCode);
        konami = konami.slice(-10);
        
        if (konami.join(',') === konamiCode.join(',')) {
            document.body.style.animation = 'rainbow 2s infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 5000);
        }
    });
    
    // Animation rainbow pour l'easter egg
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
});

// ====================================
// FONCTIONS UTILITAIRES GLOBALES
// ====================================

// Fonction pour changer manuellement un pourcentage de skill
function updateSkillPercent(skillKey, newPercent) {
    const skillItem = document.querySelector(`.skill-item[data-key="${skillKey}"]`);
    if (skillItem) {
        skillItem.setAttribute('data-percent', newPercent);
        const progressBar = skillItem.querySelector('.skill-progress');
        const percentText = skillItem.querySelector('.skill-percent');
        
        progressBar.style.width = newPercent + '%';
        percentText.textContent = newPercent + '%';
    }
}

// Fonction pour changer le thème programmatiquement
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('theme-checkbox').checked = theme === 'light';
    localStorage.setItem('portfolio-theme', theme);
}

// Exposer les fonctions utiles
window.portfolioUtils = {
    updateSkillPercent,
    setTheme
};