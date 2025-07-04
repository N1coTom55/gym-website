// Variables globales
let currentSlide = 1
const totalSlides = 3

// Inicialización cuando el DOM está cargado
document.addEventListener("DOMContentLoaded", () => {
    initializeNavigation()
    initializeTestimonials()
    initializeScrollEffects()
    initializeContactForm()
})

// Navegación móvil
function initializeNavigation() {
    const mobileMenu = document.getElementById("mobile-menu")
    const navMenu = document.getElementById("nav-menu")
    const navLinks = document.querySelectorAll(".nav-link")

    // Toggle del menú móvil
    mobileMenu.addEventListener("click", () => {
        mobileMenu.classList.toggle("active")
        navMenu.classList.toggle("active")
    })

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("active")
            navMenu.classList.remove("active")
        })
    })

    // Cambiar estilo de navbar al hacer scroll
    window.addEventListener("scroll", () => {
        const navbar = document.getElementById("navbar")
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled")
        } else {
            navbar.classList.remove("scrolled")
        }
    })
}

// Slider de testimonios
function initializeTestimonials() {
    showSlide(currentSlide)

    // Auto-play del slider
    setInterval(() => {
        currentSlide = currentSlide >= totalSlides ? 1 : currentSlide + 1
    showSlide(currentSlide)
}, 5000)
}

function showSlide(n) {
    const slides = document.querySelectorAll(".testimonial-card")
    const dots = document.querySelectorAll(".dot")

    if (n > totalSlides) currentSlide = 1
    if (n < 1) currentSlide = totalSlides

    // Ocultar todas las slides
    slides.forEach((slide) => {
        slide.classList.remove("active")
    })

    // Remover clase active de todos los dots
    dots.forEach((dot) => {
        dot.classList.remove("active")
    })

    // Mostrar slide actual y activar dot correspondiente
    if (slides[currentSlide - 1]) {
        slides[currentSlide - 1].classList.add("active")
    }
    if (dots[currentSlide - 1]) {
        dots[currentSlide - 1].classList.add("active")
    }
}

// Función para cambiar slide manualmente
function currentSlideFunc(n) {
    currentSlide = n
    showSlide(currentSlide)
}

// Efectos de scroll y animaciones
function initializeScrollEffects() {
    // Intersection Observer para animaciones
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in-up")
            }
        })
    }, observerOptions)

    // Observar elementos para animaciones
    const animatedElements = document.querySelectorAll(".service-card, .trainer-card, .pricing-card, .feature")
    animatedElements.forEach((el) => {
        observer.observe(el)
    })

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault()
            const target = document.querySelector(this.getAttribute("href"))
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })
            }
        })
    })
}

// Formulario de contacto
function initializeContactForm() {
    const contactForm = document.querySelector(".contact-form")

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault()

            // Obtener datos del formulario
            const formData = new FormData(this)
            const name = this.querySelector('input[type="text"]').value
            const email = this.querySelector('input[type="email"]').value
            const phone = this.querySelector('input[type="tel"]').value
            const message = this.querySelector("textarea").value

            // Validación básica
            if (!name || !email || !message) {
                showNotification("Por favor, completa todos los campos requeridos.", "error")
                return
            }

            if (!isValidEmail(email)) {
                showNotification("Por favor, ingresa un email válido.", "error")
                return
            }

            // Simular envío del formulario
            showNotification("¡Mensaje enviado correctamente! Te contactaremos pronto.", "success")
            this.reset()
        })
    }
}

// Validación de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// Sistema de notificaciones
function showNotification(message, type = "info") {
    // Crear elemento de notificación
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `

    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#27ae60" : type === "error" ? "#e74c3c" : "#3498db"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `

    // Agregar al DOM
    document.body.appendChild(notification)

    // Animar entrada
    setTimeout(() => {
        notification.style.transform = "translateX(0)"
    }, 100)

    // Cerrar notificación
    const closeBtn = notification.querySelector(".notification-close")
    closeBtn.addEventListener("click", () => {
        closeNotification(notification)
    })

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        closeNotification(notification)
    }, 5000)
}

function closeNotification(notification) {
    notification.style.transform = "translateX(400px)"
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification)
        }
    }, 300)
}

// Contador animado para estadísticas
function animateCounters() {
    const counters = document.querySelectorAll(".stat h3")

    counters.forEach((counter) => {
        const target = Number.parseInt(counter.textContent)
        const increment = target / 100
        let current = 0

        const timer = setInterval(() => {
            current += increment
            if (current >= target) {
                counter.textContent = target + (counter.textContent.includes("+") ? "+" : "")
                clearInterval(timer)
            } else {
                counter.textContent = Math.floor(current) + (counter.textContent.includes("+") ? "+" : "")
            }
        }, 20)
    })
}

// Lazy loading para imágenes
function initializeLazyLoading() {
    const images = document.querySelectorAll("img[data-src]")

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target
                img.src = img.dataset.src
                img.classList.remove("lazy")
                imageObserver.unobserve(img)
            }
        })
    })

    images.forEach((img) => imageObserver.observe(img))
}

// Funciones de utilidad
function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

//Optimización de scroll
const optimizedScroll = debounce(() => {
    //Lógica de scroll optimizada
}, 10)

window.addEventListener("scroll", optimizedScroll)

// Preloader (opcional)
window.addEventListener("load", () => {
    const preloader = document.querySelector(".preloader")
    if (preloader) {
        preloader.style.opacity = "0"
        setTimeout(() => {
            preloader.style.display = "none"
        }, 300)
    }

    // Inicializar contadores cuando la página esté cargada
    setTimeout(animateCounters, 1000)
})

// Manejo de errores globales
window.addEventListener("error", (e) => {
    console.error("Error en la aplicación:", e.error)
})

// Funciones expuestas globalmente para uso en HTML
window.currentSlide = currentSlideFunc