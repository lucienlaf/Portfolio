document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const navButtons = document.querySelectorAll('.nav-button');
    let activeSection = '';

    // Intersection Observer for sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                setActiveSection(sectionId);
            }
        });
    }, {
        threshold: 0.3
    });

    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });

    // Set active section and update navigation
    function setActiveSection(sectionId) {
        if (activeSection === sectionId) return;
        
        activeSection = sectionId;
        
        // Update navigation buttons
        navButtons.forEach(button => {
            const parentItem = button.closest('.nav-item');
            if (parentItem.dataset.section === sectionId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // Smooth scroll to section when clicking navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.closest('.nav-item').dataset.section;
            const section = document.getElementById(sectionId);
            
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initial check for visible sections
    setTimeout(() => {
        const visibleSection = Array.from(sections).find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top >= 0 && rect.bottom <= window.innerHeight;
        });

        if (visibleSection) {
            setActiveSection(visibleSection.id);
        }
    }, 100);

    // Add visible class to sections when they come into view
    const appearOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        appearOnScroll.observe(section);
    });
});