// Simple interactivity for the booking website

// Global variables
let makkahSections, madinahSections, resetBtn;
let currentPackageData = {};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sections
    makkahSections = document.querySelectorAll('.packages.makkah');
    madinahSections = document.querySelectorAll('.packages.madinah');
    resetBtn = document.querySelector('.reset-filter-btn');
});

// Smooth scroll with offset for sticky header
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    // Hide hero, services, and whatsapp groups sections
    const heroBanner = document.querySelector('.hero-banner');
    const servicesSection = document.querySelector('.services-section');
    const whatsappGroupsSection = document.querySelector('.whatsapp-groups-section');
    if (heroBanner) heroBanner.style.display = 'none';
    if (servicesSection) servicesSection.style.display = 'none';
    if (whatsappGroupsSection) whatsappGroupsSection.style.display = 'none';
    
    // Show back buttons
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(btn => btn.style.display = 'inline-flex');
    
    // Initialize sections if not already done
    if (!makkahSections || !madinahSections) {
        makkahSections = document.querySelectorAll('.packages.makkah');
        madinahSections = document.querySelectorAll('.packages.madinah');
        resetBtn = document.querySelector('.reset-filter-btn');
    }
    
    // Hide all sections first
    const allSections = [...makkahSections, ...madinahSections];
    allSections.forEach(sec => {
        if (sec.id !== sectionId) {
            sec.style.display = 'none';
            sec.classList.add('hidden');
            sec.classList.remove('show');
        }
    });
    
    // Show only the selected section
    section.style.display = 'block';
    section.style.opacity = '1';
    section.style.transform = 'translateY(0)';
    section.classList.remove('hidden');
    section.classList.add('show');
    
    // Show reset button
    if (resetBtn) {
        resetBtn.style.display = 'block';
    }
    
    // Calculate offset for sticky header
    const headerHeight = document.querySelector('.simple-header') ? document.querySelector('.simple-header').offsetHeight : 0;
    
    // Small delay to ensure rendering
    setTimeout(() => {
        const sectionPosition = section.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = sectionPosition - headerHeight - 20;
        
        // Smooth scroll to section
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }, 100);
}

// Add scroll shadow to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.simple-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Booking Modal Functions
let currentPackageType = '';

function bookViaWhatsApp(serviceType) {
    currentPackageType = serviceType;
    openBookingModal(serviceType);
}

function openBookingModal(packageType) {
    const modal = document.getElementById('bookingModal');
    const packageTypeInput = document.getElementById('packageType');
    
    // Set package type
    packageTypeInput.value = packageType;
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('arrivalDate').setAttribute('min', today);
    
    // Auto-detect city from package type
    const citySelect = document.getElementById('packageCity');
    if (packageType.includes('مكة') && !packageType.includes('المدينة')) {
        citySelect.value = 'مكة';
    } else if (packageType.includes('المدينة') && !packageType.includes('مكة')) {
        citySelect.value = 'المدينة';
    } else if (packageType.includes('عمرة') || packageType.includes('زيارة')) {
        citySelect.value = 'مكة والمدينة';
    }
    
    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById('customerName').focus();
    }, 300);
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // Reset form
    document.getElementById('bookingForm').reset();
}

function submitBooking(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('customerName').value.trim(),
        whatsapp: document.getElementById('whatsappNumber').value.trim(),
        city: document.getElementById('packageCity').value,
        packageType: document.getElementById('packageType').value,
        arrivalDate: document.getElementById('arrivalDate').value,
        numberOfPeople: document.getElementById('numberOfPeople').value,
        notes: document.getElementById('notes').value.trim() || 'لا توجد'
    };
    
    // Validate phone number
    if (!/^[0-9]{10}$/.test(formData.whatsapp)) {
        alert('الرجاء إدخال رقم واتساب صحيح (10 أرقام)');
        return;
    }
    
    // Format date to Arabic
    const dateObj = new Date(formData.arrivalDate);
    const formattedDate = dateObj.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    
    // Create WhatsApp message
    const message = `
🌟 *طلب حجز جديد* 🌟

👤 *الاسم:* ${formData.name}
📱 *الواتساب:* ${formData.whatsapp}
📦 *الباقة:* ${formData.packageType}
📍 *المدينة:* ${formData.city}
📅 *تاريخ الوصول:* ${formattedDate}
👥 *عدد الأشخاص:* ${formData.numberOfPeople}
📝 *ملاحظات:* ${formData.notes}

━━━━━━━━━━━━━━━
_تم الإرسال من موقع باقات السكن_
    `.trim();
    
    // WhatsApp number
    const phoneNumber = '966597964958';
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Show success message
    const submitBtn = event.target.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> تم الإرسال بنجاح!';
    submitBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
    
    // Close modal after short delay
    setTimeout(() => {
        closeBookingModal();
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
    }, 1500);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('bookingModal');
    if (event.target === modal) {
        closeBookingModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('bookingModal');
        if (modal.classList.contains('show')) {
            closeBookingModal();
        }
    }
});

function showMakkahContent() {
    if (!makkahSections || !madinahSections) {
        makkahSections = document.querySelectorAll('.packages.makkah');
        madinahSections = document.querySelectorAll('.packages.madinah');
        resetBtn = document.querySelector('.reset-filter-btn');
    }
    
    // Add to browser history
    history.pushState({ page: 'makkah' }, 'مكة - باقات السكن', '#makkah');
    
    // Hide hero, services, and whatsapp groups sections
    const heroBanner = document.querySelector('.hero-banner');
    const servicesSection = document.querySelector('.services-section');
    const whatsappGroupsSection = document.querySelector('.whatsapp-groups-section');
    if (heroBanner) heroBanner.style.display = 'none';
    if (servicesSection) servicesSection.style.display = 'none';
    if (whatsappGroupsSection) whatsappGroupsSection.style.display = 'none';
    
    // Show back buttons
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(btn => btn.style.display = 'inline-flex');
    
    // Hide Madinah sections
    madinahSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        setTimeout(() => {
            section.classList.add('hidden');
            section.classList.remove('show');
        }, 300);
    });
    
    // Show Makkah sections
    setTimeout(() => {
        makkahSections.forEach((section, index) => {
            section.classList.remove('hidden');
            section.classList.add('show');
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
    
    // Show reset button
    if (resetBtn) {
        resetBtn.style.display = 'block';
    }
    
    // Scroll to first makkah section
    setTimeout(() => {
        if (makkahSections[0]) {
            makkahSections[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 400);
}

function showMadinahContent() {
    if (!makkahSections || !madinahSections) {
        makkahSections = document.querySelectorAll('.packages.makkah');
        madinahSections = document.querySelectorAll('.packages.madinah');
        resetBtn = document.querySelector('.reset-filter-btn');
    }
    
    // Add to browser history
    history.pushState({ page: 'madinah' }, 'المدينة - باقات السكن', '#madinah');
    
    // Hide hero, services, and whatsapp groups sections
    const heroBanner = document.querySelector('.hero-banner');
    const servicesSection = document.querySelector('.services-section');
    const whatsappGroupsSection = document.querySelector('.whatsapp-groups-section');
    if (heroBanner) heroBanner.style.display = 'none';
    if (servicesSection) servicesSection.style.display = 'none';
    if (whatsappGroupsSection) whatsappGroupsSection.style.display = 'none';
    
    // Show back buttons
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(btn => btn.style.display = 'inline-flex');
    
    // Hide Makkah sections
    makkahSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        setTimeout(() => {
            section.classList.add('hidden');
            section.classList.remove('show');
        }, 300);
    });
    
    // Show Madinah sections
    setTimeout(() => {
        madinahSections.forEach((section, index) => {
            section.classList.remove('hidden');
            section.classList.add('show');
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
    
    // Show reset button
    if (resetBtn) {
        resetBtn.style.display = 'block';
    }
    
    // Scroll to madinah section
    setTimeout(() => {
        if (madinahSections[0]) {
            madinahSections[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 400);
}

// Function to show all sections
window.showAllSections = function() {
    if (!makkahSections || !madinahSections) {
        makkahSections = document.querySelectorAll('.packages.makkah');
        madinahSections = document.querySelectorAll('.packages.madinah');
    }
    
    const allSections = [...makkahSections, ...madinahSections];
    allSections.forEach((section, index) => {
        section.style.display = 'block';
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
        section.classList.remove('hidden');
        section.classList.add('show');
    });
    
    // Scroll to first section
    setTimeout(() => {
        if (allSections[0]) {
            const headerHeight = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 0;
            const sectionPosition = allSections[0].getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = sectionPosition - headerHeight - 20;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, 200);
};

// Go to home function
function goToHome(event) {
    event.preventDefault();
    location.reload();
}


// Function to select Makkah from simple header
function selectMakkah(event) {
    event.preventDefault();
    showMakkahContent();
}

// Function to select Madinah from simple header
function selectMadinah(event) {
    event.preventDefault();
    showMadinahContent();
}

// Quick Links functionality
document.addEventListener('DOMContentLoaded', function() {
    const quickLinksBtn = document.getElementById('quickLinksBtn');
    const quickLinksMenu = document.getElementById('quickLinksMenu');
    
    if (quickLinksBtn && quickLinksMenu) {
        quickLinksBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            quickLinksBtn.classList.toggle('active');
            quickLinksMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!quickLinksBtn.contains(e.target) && !quickLinksMenu.contains(e.target)) {
                quickLinksBtn.classList.remove('active');
                quickLinksMenu.classList.remove('show');
            }
        });
        
        // Close dropdown when clicking on a link
        const quickLinkItems = quickLinksMenu.querySelectorAll('.quick-link-item');
        quickLinkItems.forEach(item => {
            item.addEventListener('click', function() {
                quickLinksBtn.classList.remove('active');
                quickLinksMenu.classList.remove('show');
            });
        });
    }
});


// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    if (event.state) {
        // User pressed back/forward
        if (event.state.page === 'makkah') {
            showMakkahContent();
        } else if (event.state.page === 'madinah') {
            showMadinahContent();
        } else if (event.state.page === 'home') {
            location.reload();
        }
    } else {
        // No state means we're back to the original page
        location.reload();
    }
});

// Set initial state for home page
if (!history.state) {
    history.replaceState({ page: 'home' }, 'باقات السكن - مكة والمدينة', window.location.pathname);
}


// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const body = document.body;
    
    if (hamburgerBtn && mobileNav && mobileOverlay) {
        // Toggle menu
        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Close menu when clicking overlay
        mobileOverlay.addEventListener('click', function() {
            closeMobileMenu();
        });
        
        // Close menu when clicking on a link
        const navLinks = mobileNav.querySelectorAll('.simple-header-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
        
        // Close menu on window resize if open
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    function toggleMobileMenu() {
        hamburgerBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        body.classList.toggle('menu-open');
    }
    
    function closeMobileMenu() {
        hamburgerBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        mobileOverlay.classList.remove('active');
        body.classList.remove('menu-open');
    }
    
    // Make closeMobileMenu available globally
    window.closeMobileMenu = closeMobileMenu;
});


// Add click event to all book buttons in packages
document.addEventListener('DOMContentLoaded', function() {
    const bookButtons = document.querySelectorAll('.book-btn');
    
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get package card
            const packageCard = this.closest('.package-card');
            
            // Get package title
            const packageTitle = packageCard.querySelector('h3').textContent;
            
            // Get package location
            const packageLocation = packageCard.querySelector('.package-location').textContent.replace('📍 ', '');
            
            // Determine package type based on section
            const section = packageCard.closest('.packages');
            let packageType = packageTitle;
            
            if (section) {
                const sectionTitle = section.querySelector('.section-title');
                if (sectionTitle) {
                    packageType = `${packageTitle} - ${sectionTitle.textContent.split('-')[0].trim()}`;
                }
            }
            
            // Open booking modal
            openBookingModal(packageType);
        });
    });
});


// Statistics Counter Animation
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// Intersection Observer for counter animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                if (counter.textContent === '0') {
                    animateCounter(counter);
                }
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe stats section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }
});


// Scroll to services section
function scrollToServices() {
    const servicesSection = document.querySelector('.services-section');
    if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Contact us via WhatsApp
function contactUs() {
    const phoneNumber = '966597964958'; // رقم الواتساب الجديد
    const message = 'مرحباً، أريد الاستفسار عن خدماتكم';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}


// Scroll to Top Button Functionality
document.addEventListener('DOMContentLoaded', function() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Show/Hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });
        
        // Scroll to top when clicked
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
