// Presentation App with GSAP Animations - Fixed Version
class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 12;
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSlideCounter();
        this.updateNavigationButtons();
        this.initializeFirstSlide();
    }

    setupEventListeners() {
        // Navigation buttons - Fixed event binding
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.previousSlide();
            });
            
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.nextSlide();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;
            
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.nextSlide();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousSlide();
            } else if (e.key === 'Home') {
                e.preventDefault();
                this.goToSlide(1);
            } else if (e.key === 'End') {
                e.preventDefault();
                this.goToSlide(this.totalSlides);
            }
        });
    }

    initializeFirstSlide() {
        const firstSlide = document.querySelector('.slide[data-slide="1"]');
        if (firstSlide) {
            firstSlide.classList.add('active');
            this.animateSlideIn(firstSlide);
        }
    }

    nextSlide() {
        if (this.isAnimating || this.currentSlide >= this.totalSlides) return;
        
        console.log('Next slide clicked, current:', this.currentSlide);
        this.goToSlide(this.currentSlide + 1);
    }

    previousSlide() {
        if (this.isAnimating || this.currentSlide <= 1) return;
        
        console.log('Previous slide clicked, current:', this.currentSlide);
        this.goToSlide(this.currentSlide - 1);
    }

    goToSlide(targetSlide) {
        if (this.isAnimating || targetSlide < 1 || targetSlide > this.totalSlides) return;
        
        this.isAnimating = true;
        
        const currentSlideElement = document.querySelector('.slide.active');
        const targetSlideElement = document.querySelector(`[data-slide="${targetSlide}"]`);
        
        if (!currentSlideElement || !targetSlideElement) {
            this.isAnimating = false;
            return;
        }

        // Create timeline for slide transition
        const tl = gsap.timeline({
            onComplete: () => {
                this.currentSlide = targetSlide;
                this.updateSlideCounter();
                this.updateNavigationButtons();
                this.isAnimating = false;
                console.log('Slide transition complete to:', this.currentSlide);
            }
        });

        // Animate current slide out
        tl.to(currentSlideElement, {
            opacity: 0,
            x: targetSlide > this.currentSlide ? -100 : 100,
            duration: 0.4,
            ease: "power2.inOut"
        });

        // Remove active class and add to new slide
        tl.call(() => {
            currentSlideElement.classList.remove('active');
            targetSlideElement.classList.add('active');
            
            // Reset target slide position
            gsap.set(targetSlideElement, {
                x: targetSlide > this.currentSlide ? 100 : -100,
                opacity: 0
            });
        });

        // Animate new slide in
        tl.to(targetSlideElement, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: "power2.inOut"
        });

        // Animate slide content
        tl.call(() => {
            this.animateSlideContent(targetSlideElement);
        }, null, "-=0.2");
    }

    animateSlideIn(slideElement) {
        // Initial setup
        gsap.set(slideElement, { opacity: 1, x: 0 });
        
        // Animate content
        this.animateSlideContent(slideElement);
    }

    animateSlideContent(slideElement) {
        const slideNumber = parseInt(slideElement.dataset.slide);
        
        // Reset all animations for content elements
        const contentElements = slideElement.querySelectorAll('.slide-content *');
        gsap.set(contentElements, { clearProps: "all" });
        
        // Create timeline for content animation
        const tl = gsap.timeline({ delay: 0.1 });
        
        switch(slideNumber) {
            case 1:
                this.animateTitleSlide(tl, slideElement);
                break;
            case 2:
            case 3:
            case 4:
                this.animateContentSlide(tl, slideElement);
                break;
            case 5:
            case 7:
            case 9:
                this.animateSceneSlide(tl, slideElement);
                break;
            case 6:
            case 8:
            case 10:
                this.animateAnalysisSlide(tl, slideElement);
                break;
            case 11:
                this.animateThemesSlide(tl, slideElement);
                break;
            case 12:
                this.animateConclusionSlide(tl, slideElement);
                break;
            default:
                this.animateContentSlide(tl, slideElement);
        }
    }

    animateTitleSlide(tl, slide) {
        const title = slide.querySelector('.main-title');
        const subtitle = slide.querySelector('.subtitle');
        const line = slide.querySelector('.decorative-line');
        const classInfo = slide.querySelector('.class-info');
        const credit = slide.querySelector('.author-credit');

        if (title) {
            tl.fromTo(title, 
                { opacity: 0, y: 50, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.2)" }
            );
        }
        
        if (subtitle) {
            tl.fromTo(subtitle,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
                "-=0.5"
            );
        }
        
        if (line) {
            tl.fromTo(line,
                { opacity: 0, scaleX: 0 },
                { opacity: 1, scaleX: 1, duration: 0.8, ease: "power2.out" },
                "-=0.3"
            );
        }
        
        if (classInfo) {
            tl.fromTo(classInfo,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                "-=0.2"
            );
        }
        
        if (credit) {
            tl.fromTo(credit,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
                "-=0.1"
            );
        }
    }

    animateContentSlide(tl, slide) {
        const title = slide.querySelector('.slide-title');
        const textElements = slide.querySelectorAll('.text-content > *, .author-details > *, .theme-item, .character-card');
        const credit = slide.querySelector('.author-credit');

        if (title) {
            tl.fromTo(title,
                { opacity: 0, y: -30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );
        }

        if (textElements.length > 0) {
            tl.fromTo(textElements,
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.6, 
                    ease: "power2.out",
                    stagger: 0.1
                },
                "-=0.4"
            );
        }

        if (credit) {
            tl.fromTo(credit,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
                "-=0.2"
            );
        }
    }

    animateSceneSlide(tl, slide) {
        const title = slide.querySelector('.slide-title');
        const image = slide.querySelector('.scene-image img');
        const imageContainer = slide.querySelector('.scene-image');
        const textElements = slide.querySelectorAll('.scene-text > *');
        const credit = slide.querySelector('.author-credit');

        if (title) {
            tl.fromTo(title,
                { opacity: 0, y: -30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );
        }
        
        if (imageContainer) {
            tl.fromTo(imageContainer,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
                "-=0.4"
            );
        }

        if (image) {
            tl.fromTo(image,
                { opacity: 0, scale: 1.1 },
                { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
                "-=0.6"
            );
        }

        if (textElements.length > 0) {
            tl.fromTo(textElements,
                { opacity: 0, x: 30 },
                { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.6, 
                    ease: "power2.out",
                    stagger: 0.1
                },
                "-=0.8"
            );
        }
        
        if (credit) {
            tl.fromTo(credit,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
                "-=0.2"
            );
        }
    }

    animateAnalysisSlide(tl, slide) {
        const title = slide.querySelector('.slide-title');
        const image = slide.querySelector('.analysis-image img');
        const imageContainer = slide.querySelector('.analysis-image');
        const sections = slide.querySelectorAll('.key-themes, .important-quotes, .character-development');
        const quotes = slide.querySelectorAll('blockquote');
        const credit = slide.querySelector('.author-credit');

        if (title) {
            tl.fromTo(title,
                { opacity: 0, y: -30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );
        }

        if (imageContainer) {
            tl.fromTo(imageContainer,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 1, ease: "power2.out" },
                "-=0.4"
            );
        }

        if (image) {
            tl.fromTo(image,
                { opacity: 0, scale: 1.1 },
                { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
                "-=0.6"
            );
        }

        if (sections.length > 0) {
            tl.fromTo(sections,
                { opacity: 0, y: 40 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.7, 
                    ease: "power2.out",
                    stagger: 0.15
                },
                "-=0.6"
            );
        }

        if (quotes.length > 0) {
            tl.fromTo(quotes,
                { opacity: 0, x: -20 },
                { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.6, 
                    ease: "power2.out",
                    stagger: 0.1
                },
                "-=0.4"
            );
        }

        if (credit) {
            tl.fromTo(credit,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
                "-=0.2"
            );
        }
    }

    animateThemesSlide(tl, slide) {
        const title = slide.querySelector('.slide-title');
        const themeCards = slide.querySelectorAll('.theme-card');
        const credit = slide.querySelector('.author-credit');

        if (title) {
            tl.fromTo(title,
                { opacity: 0, y: -30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );
        }
        
        if (themeCards.length > 0) {
            tl.fromTo(themeCards,
                { 
                    opacity: 0, 
                    y: 50, 
                    scale: 0.9
                },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    duration: 0.8, 
                    ease: "back.out(1.1)",
                    stagger: 0.1
                },
                "-=0.4"
            );
        }
        
        if (credit) {
            tl.fromTo(credit,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
                "-=0.2"
            );
        }
    }

    animateConclusionSlide(tl, slide) {
        const title = slide.querySelector('.slide-title');
        const sections = slide.querySelectorAll('.key-takeaways, .relevance');
        const finalQuote = slide.querySelector('.final-quote');
        const listItems = slide.querySelectorAll('.key-takeaways li');
        const credit = slide.querySelector('.author-credit');

        if (title) {
            tl.fromTo(title,
                { opacity: 0, y: -30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );
        }
        
        if (sections.length > 0) {
            tl.fromTo(sections,
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.7, 
                    ease: "power2.out",
                    stagger: 0.2
                },
                "-=0.4"
            );
        }

        if (listItems.length > 0) {
            tl.fromTo(listItems,
                { opacity: 0, x: -30 },
                { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.5, 
                    ease: "power2.out",
                    stagger: 0.1
                },
                "-=0.5"
            );
        }

        if (finalQuote) {
            tl.fromTo(finalQuote,
                { 
                    opacity: 0, 
                    scale: 0.9
                },
                { 
                    opacity: 1, 
                    scale: 1,
                    duration: 1, 
                    ease: "back.out(1.1)"
                },
                "-=0.3"
            );
        }

        if (credit) {
            tl.fromTo(credit,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
                "-=0.2"
            );
        }
    }

    updateSlideCounter() {
        const currentSlideEl = document.getElementById('currentSlide');
        const totalSlidesEl = document.getElementById('totalSlides');
        
        if (currentSlideEl) currentSlideEl.textContent = this.currentSlide;
        if (totalSlidesEl) totalSlidesEl.textContent = this.totalSlides;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.disabled = this.currentSlide <= 1;
            prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentSlide >= this.totalSlides;
            nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
        }
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing presentation...');
    
    // Set up GSAP defaults
    gsap.defaults({
        ease: "power2.out",
        duration: 0.6
    });

    // Initialize the presentation app
    const app = new PresentationApp();
    
    // Add loading animation
    gsap.fromTo('body', 
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out" }
    );

    // Add floating animation to navigation
    const navigation = document.querySelector('.navigation');
    if (navigation) {
        gsap.to(navigation, {
            y: -3,
            duration: 2,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
        });
    }

    // Preload images
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    
    images.forEach(img => {
        const newImg = new Image();
        newImg.onload = () => {
            loadedImages++;
            if (loadedImages === images.length) {
                console.log('All images preloaded');
            }
        };
        newImg.onerror = () => {
            console.warn('Failed to load image:', img.src);
        };
        newImg.src = img.src;
    });

    console.log('✨ Presentation "On the Face of It" initialized successfully!');
    console.log('📚 Navigate using arrow keys or navigation buttons');
    console.log('🎭 Created by Manas Tiwari');
});