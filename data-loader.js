// تحميل البيانات من ملف JSON وتحديث الموقع تلقائياً

// دالة تحميل البيانات
async function loadSiteData() {
    try {
        const response = await fetch('get-data.php');
        if (!response.ok) {
            throw new Error('Failed to load data');
        }
        const data = await response.json();

        // تحديث بيانات التواصل
        updateContactInfo(data.contact);

        // تحديث الباقات
        updatePackages(data.packages);

        // تحديث معلومات الموقع
        updateSiteInfo(data.site_info);

        console.log('✅ تم تحميل البيانات بنجاح');
    } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error);
        // في حالة الخطأ، سيتم استخدام البيانات الموجودة في HTML
    }
}

// تحديث بيانات التواصل
function updateContactInfo(contact) {
    if (!contact) return;

    // تحديث أرقام الهاتف في جميع الأماكن
    const whatsappNumber = contact.whatsapp;
    const bookingsNumber = contact.bookings;
    const suggestionsNumber = contact.suggestions;
    const email = contact.email;

    // تحديث زر الواتساب العائم
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        whatsappFloat.href = `https://wa.me/${whatsappNumber}?text=السلام عليكم، أريد الاستفسار عن الباقات`;
    }

    // تحديث قسم التواصل - كرت الواتساب
    const whatsappInfo = document.querySelector('.whatsapp-card .contact-card-info');
    if (whatsappInfo) {
        whatsappInfo.textContent = `+${whatsappNumber.substring(0, 3)} ${whatsappNumber.substring(3, 5)} ${whatsappNumber.substring(5, 8)} ${whatsappNumber.substring(8)}`;
    }

    const whatsappBtn = document.querySelector('.whatsapp-card .whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.href = `https://wa.me/${whatsappNumber}?text=السلام عليكم، أريد الاستفسار عن الخدمات`;
    }

    // تحديث كرت الحجوزات
    const bookingsInfo = document.querySelector('.phone-card .contact-card-info');
    if (bookingsInfo) {
        bookingsInfo.textContent = `+${bookingsNumber.substring(0, 3)} ${bookingsNumber.substring(3, 5)} ${bookingsNumber.substring(5, 8)} ${bookingsNumber.substring(8)}`;
    }

    const bookingsBtn = document.querySelector('.phone-card .phone-btn');
    if (bookingsBtn) {
        bookingsBtn.href = `tel:+${bookingsNumber}`;
    }

    // تحديث كرت البريد الإلكتروني
    const emailInfo = document.querySelector('.email-card .contact-card-info');
    if (emailInfo) {
        emailInfo.textContent = email;
    }

    const emailBtn = document.querySelector('.email-card .email-btn');
    if (emailBtn) {
        emailBtn.href = `mailto:${email}`;
    }

    // تحديث كرت المقترحات والشكاوى
    const suggestionsInfo = document.querySelector('.location-card .contact-card-info');
    if (suggestionsInfo) {
        suggestionsInfo.textContent = `+${suggestionsNumber.substring(0, 3)} ${suggestionsNumber.substring(3, 5)} ${suggestionsNumber.substring(5, 8)} ${suggestionsNumber.substring(8)}`;
    }

    const suggestionsBtn = document.querySelector('.location-card .location-btn');
    if (suggestionsBtn) {
        suggestionsBtn.href = `tel:+${suggestionsNumber}`;
    }

    // تحديث Footer
    const footerContact = document.querySelector('.footer-contact');
    if (footerContact) {
        footerContact.innerHTML = `
            <li>📞 <a href="tel:+${bookingsNumber}">+${bookingsNumber.substring(0, 3)} ${bookingsNumber.substring(3, 5)} ${bookingsNumber.substring(5, 8)} ${bookingsNumber.substring(8)}</a> (حجوزات)</li>
            <li>📞 <a href="tel:+${suggestionsNumber}">+${suggestionsNumber.substring(0, 3)} ${suggestionsNumber.substring(3, 5)} ${suggestionsNumber.substring(5, 8)} ${suggestionsNumber.substring(8)}</a> (مقترحات)</li>
            <li>✉️ <a href="mailto:${email}">${email}</a></li>
            <li>💬 <a href="https://wa.me/${whatsappNumber}" target="_blank">واتساب</a></li>
        `;
    }

    // تحديث مجموعات الواتساب
    const whatsappGroups = document.querySelectorAll('.whatsapp-group-btn');
    whatsappGroups.forEach((btn, index) => {
        if (index === 0) {
            btn.href = `https://wa.me/${whatsappNumber}?text=أريد الانضمام لمجموعة عروض مكة والمدينة`;
        } else if (index === 1) {
            btn.href = `https://wa.me/${whatsappNumber}?text=أريد الانضمام لمجموعة عروض الحج والعمرة`;
        }
    });

    // تحديث أرقام JavaScript
    if (typeof window.contactUs === 'function') {
        // سيتم استخدام الرقم الجديد في دالة contactUs
        window.siteWhatsappNumber = whatsappNumber;
    }
}

// تحديث الباقات
function updatePackages(packages) {
    if (!packages) return;

    // تحديث برنامج الزيارة
    if (packages.madinah_visit) {
        updatePackageSection('programs-room', packages.madinah_visit);
    }

    // تحديث برنامج العمرة
    if (packages.umrah_program) {
        updatePackageSection('programs-bed', packages.umrah_program);
    }

    // تحديث سكن مكة
    if (packages.makkah_hotel) {
        updatePackageSection('makkah-hotel', packages.makkah_hotel);
    }

    // تحديث سكن المدينة
    if (packages.madinah_hotel) {
        updatePackageSection('madinah', packages.madinah_hotel);
    }
}

// تحديث قسم باقات معين
function updatePackageSection(sectionId, packagesData) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const packageCards = section.querySelectorAll('.package-card');

    packagesData.forEach((packageData, index) => {
        if (packageCards[index]) {
            const card = packageCards[index];

            // تحديث اسم الباقة
            const title = card.querySelector('h3');
            if (title) {
                title.textContent = packageData.name;
            }

            // تحديث الموقع
            const location = card.querySelector('.package-location');
            if (location) {
                location.textContent = `📍 ${packageData.location}`;
            }

            // تحديث الوصف
            const description = card.querySelector('.package-description');
            if (description) {
                description.textContent = packageData.description;
            }

            // تحديث السعر
            const priceElement = card.querySelector('.package-price .price');
            if (priceElement) {
                priceElement.innerHTML = `${packageData.price} <span>ريال</span>`;
            }

            // تحديث الوحدة
            const unitElement = card.querySelector('.package-price .per');
            if (unitElement) {
                unitElement.textContent = packageData.unit;
            }
        }
    });
}

// تحديث معلومات الموقع
function updateSiteInfo(siteInfo) {
    if (!siteInfo) return;

    // تحديث عنوان Hero
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle && siteInfo.hero_title) {
        heroTitle.textContent = siteInfo.hero_title;
    }

    // تحديث وصف Hero
    const heroSubtitle = document.querySelector('.hero-text p');
    if (heroSubtitle && siteInfo.hero_subtitle) {
        heroSubtitle.textContent = siteInfo.hero_subtitle;
    }

    // تحديث عنوان الخدمات
    const servicesTitle = document.querySelector('.services-title');
    if (servicesTitle && siteInfo.services_title) {
        servicesTitle.textContent = siteInfo.services_title;
    }

    // تحديث وصف الخدمات
    const servicesSubtitle = document.querySelector('.services-subtitle');
    if (servicesSubtitle && siteInfo.services_subtitle) {
        servicesSubtitle.textContent = siteInfo.services_subtitle;
    }
}

// تحميل البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function () {
    loadSiteData();
});

// إعادة تحميل البيانات كل 5 دقائق (اختياري)
// setInterval(loadSiteData, 5 * 60 * 1000);
