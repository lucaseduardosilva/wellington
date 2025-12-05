let currentLang = localStorage.getItem('lang') || 'pt';

function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
}

function translatePage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedValue(translations[lang], key);
        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else if (element.hasAttribute('data-i18n-href')) {
                const hrefKey = element.getAttribute('data-i18n-href');
                const hrefTranslation = getNestedValue(translations[lang], hrefKey);
                if (hrefTranslation && lang === 'en') {
                    element.href = `https://wa.me/5519995963470?text=Hello,%20I%20would%20like%20to%20request%20a%20quote`;
                } else if (hrefTranslation && lang === 'pt') {
                    element.href = `https://wa.me/5519995963470?text=Olá,%20gostaria%20de%20solicitar%20um%20orçamento`;
                }
            } else {
                element.textContent = translation;
            }
        }
    });
    
    document.documentElement.lang = lang;
    const langFlagImg = document.getElementById('lang-flag-img');
    if (langFlagImg) {
        langFlagImg.src = lang === 'pt' ? 'images/en.png' : 'images/pt.png';
        langFlagImg.alt = lang === 'pt' ? 'English' : 'Português';
    }
    
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        if (lang === 'en') {
            if (link.textContent.includes('Consultar') || link.textContent.includes('Check')) {
                link.href = 'https://wa.me/5519995963470?text=Hello,%20I%20would%20like%20to%20check%20available%20vehicles';
            } else if (link.textContent.includes('Falar') || link.textContent.includes('Talk')) {
                link.href = 'https://wa.me/5519995963470?text=Hello,%20I%20would%20like%20to%20request%20a%20quote';
            }
        } else {
            if (link.textContent.includes('Consultar') || link.textContent.includes('Check')) {
                link.href = 'https://wa.me/5519995963470?text=Olá,%20gostaria%20de%20consultar%20os%20veículos%20disponíveis';
            } else if (link.textContent.includes('Falar') || link.textContent.includes('Talk')) {
                link.href = 'https://wa.me/5519995963470?text=Olá,%20gostaria%20de%20solicitar%20um%20orçamento';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    translatePage(currentLang);
    
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('click', function() {
            currentLang = currentLang === 'pt' ? 'en' : 'pt';
            localStorage.setItem('lang', currentLang);
            translatePage(currentLang);
        });
    }
    
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contato-form');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.servico-card, .diferencial-item, .stat-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const button = contactForm.querySelector('button[type="submit"]');
            const messageDiv = document.getElementById('form-message');
            const originalText = button.textContent;
            
            button.textContent = 'Enviando...';
            button.disabled = true;
            
            if (messageDiv) {
                messageDiv.className = 'form-message';
                messageDiv.style.display = 'none';
            }
            
            const formData = {
                nome: document.getElementById('nome').value,
                telefone: document.getElementById('telefone').value,
                email: document.getElementById('email').value,
                servico: document.getElementById('servico').value,
                mensagem: document.getElementById('mensagem').value
            };
            
            const emailBody = `
Nome: ${formData.nome}
Telefone: ${formData.telefone}
E-mail: ${formData.email}
Serviço: ${formData.servico}
Mensagem: ${formData.mensagem}
            `.trim();
            
            const mailtoLink = `mailto:royalcar.contato@gmail.com?subject=Solicitação de Orçamento - ${formData.servico}&body=${encodeURIComponent(emailBody)}`;
            
            window.location.href = mailtoLink;
            
            setTimeout(() => {
                if (messageDiv) {
                    messageDiv.className = 'form-message success';
                    messageDiv.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
                    messageDiv.style.display = 'block';
                }
                
                contactForm.reset();
                button.textContent = originalText;
                button.disabled = false;
                
                setTimeout(() => {
                    if (messageDiv) {
                        messageDiv.style.display = 'none';
                    }
                }, 5000);
            }, 500);
        });
    }

    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
                e.target.value = value;
            }
        });
    }

    const smoothScroll = document.querySelectorAll('a[href^="#"]');
    smoothScroll.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const isDesktop = window.innerWidth > 768;
                const isInicio = this.getAttribute('href') === '#inicio';
                const extraOffset = (isDesktop && !isInicio) ? -100 : 0;
                const targetPosition = target.offsetTop - headerHeight - extraOffset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const carouselImages = document.querySelectorAll('.carousel-image');
    const carouselDots = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentIndex = 0;
    let carouselInterval;

    if (carouselImages.length > 0) {
        carouselImages.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToSlide(index));
            carouselDots.appendChild(dot);
        });

        function showSlide(index) {
            carouselImages.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
            const dots = carouselDots.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentIndex = index;
        }

        function nextSlide() {
            const next = (currentIndex + 1) % carouselImages.length;
            showSlide(next);
        }

        function prevSlide() {
            const prev = (currentIndex - 1 + carouselImages.length) % carouselImages.length;
            showSlide(prev);
        }

        function goToSlide(index) {
            showSlide(index);
            resetCarousel();
        }

        function resetCarousel() {
            clearInterval(carouselInterval);
            carouselInterval = setInterval(nextSlide, 5000);
        }

        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetCarousel(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetCarousel(); });

        resetCarousel();
    }

    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    const toast = document.getElementById('toast');

    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.getAttribute('href').replace('mailto:', '');
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(() => {
                    showToast();
                }).catch(() => {
                    fallbackCopy(email);
                });
            } else {
                fallbackCopy(email);
            }
        });
    });

    function fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showToast();
        } catch (err) {
            console.error('Erro ao copiar:', err);
        }
        document.body.removeChild(textArea);
    }

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});

