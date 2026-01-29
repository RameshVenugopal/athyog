/**
 * Ath Yog Main Script
 * Handles animations, data fetching, interactions, and performance optimizations.
 */

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initScrollAnimations();
    initCounters();
    initMobileMenu();
    initDataFetching(); // Includes Filtering
    initTestimonialCarousel();
    initRippleEffect();
    initParallax();
});

/* --- 1. Navigation & Smooth Scroll --- */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    const headerHeight = document.querySelector('header').offsetHeight;

    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('translate-x-full')) {
                    toggleMobileMenu();
                }

                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active Link Highlighting
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - headerHeight - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`nav a[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('nav a').forEach(a => a.classList.remove('text-primary'));
                if (navLink) navLink.classList.add('text-primary');
            }
        });
    });
}

/* --- 2. Scroll Animations (Reveal) --- */
let revealObserver;

function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => revealObserver.observe(el));
}

/* --- 3. Counters Animation --- */
function initCounters() {
    const statsSection = document.querySelector('.stats-section'); // Will add this class to HTML
    if (!statsSection) return;

    const counters = document.querySelectorAll('.counter-value'); // Will add this class to HTML
    let started = false;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
            started = true;
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps

                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current).toLocaleString() + "+";
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString() + "+";
                    }
                };
                updateCounter();
            });
        }
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

/* --- 4. Mobile Menu --- */
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('close-mobile-menu');

    // Create menu if not exists (handled in HTML updates mostly, but helper here for toggle)
    window.toggleMobileMenu = () => {
        if (menu) {
            menu.classList.toggle('translate-x-full'); // Tailwind class for transform
            document.body.classList.toggle('overflow-hidden'); // Prevent scrolling body
        }
    };

    if (btn) btn.addEventListener('click', toggleMobileMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking a link
    if (menu) {
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (!menu.classList.contains('translate-x-full')) {
                    toggleMobileMenu();
                }
            });
        });
    }
}

/* --- 5. Testimonial Carousel --- */
function initTestimonialCarousel() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const slides = Array.from(track.children);
    if (slides.length === 0) return;

    let currentIndex = 0;

    // Determine items per view based on screen width
    const getItemsPerView = () => window.innerWidth >= 768 ? 3 : 1;

    const moveToSlide = (index) => {
        const itemsPerView = getItemsPerView();
        const maxIndex = slides.length - itemsPerView;

        // Loop
        if (index < 0) index = maxIndex;
        if (index > maxIndex) index = 0;

        currentIndex = index;
        const slideWidth = slides[0].getBoundingClientRect().width;
        // Fix: calc correct translate amount. 
        // Note: The slides have padding, so width calculation should be safe if sizing is responsive.
        track.style.transform = `translateX(-${index * slideWidth}px)`;
    };

    // Auto Play
    let autoPlayInterval;
    const startAutoPlay = () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => moveToSlide(currentIndex + 1), 4000);
    };

    const stopAutoPlay = () => clearInterval(autoPlayInterval);

    // Filter out if user prefers reduced motion? Maybe later.
    startAutoPlay();

    // Pause on hover (Desktop)
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);

    // Touch Support
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoPlay();
    });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        // Optional: add resistance/follow finger logic here
    });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) { // Threshold
            if (diff > 0) moveToSlide(currentIndex + 1);
            else moveToSlide(currentIndex - 1);
        }
        isDragging = false;
        startAutoPlay();
    });

    // Resize handler
    window.addEventListener('resize', () => {
        moveToSlide(currentIndex); // Recalculate positions
    });
}

/* --- 6. Data Fetching (Google Sheets) --- */
function initDataFetching() {
    const SHEET_ID = '1rBPf1PSmuoq8QM7iTAAV0ydb3SQhOxw8N3557hqbuLE';
    const EVENT_GID = '805507452';
    const COURSE_GID = '0';

    // Fetch Events
    const urlEvents = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${EVENT_GID}`;
    const eventList = document.querySelector('.event-list');

    if (eventList) {
        fetch(urlEvents)
            .then(res => res.text())
            .then(text => JSON.parse(text.replace(/^[^\{]+|\);?$/g, '')))
            .then(data => {
                const rows = data.table.rows.map(r => r.c.map(c => c ? c.v : ''));
                const [header, ...events] = rows;
                const validEvents = events.filter(ev => ev[0] && ev[0].trim() !== '');

                if (validEvents.length === 0) {
                    renderEmptyEvents(eventList);
                    return;
                }
                renderEvents(eventList, validEvents);
            })
            .catch(err => {
                console.error('Error loading events:', err);
                renderEmptyEvents(eventList, isError = true);
            });
    }

    // Fetch Classes
    const urlCourses = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${COURSE_GID}`;
    const classesGrid = document.getElementById('classes-grid');

    if (classesGrid) {
        fetch(urlCourses)
            .then(res => res.text())
            .then(text => JSON.parse(text.replace(/^[^\{]+|\);?$/g, '')))
            .then(data => {
                const rows = data.table.rows.map(r => r.c.map(c => c ? c.v : ''));
                const [header, ...courses] = rows;
                const validCourses = courses.filter(c => c[1] && c[1].trim() !== '');

                if (validCourses.length === 0) {
                    classesGrid.innerHTML = `<div class="col-span-full text-center py-12"><p class="text-navy/50">No classes found.</p></div>`;
                    return;
                }
                renderClasses(classesGrid, validCourses);
            })
            .catch(err => {
                console.error('Error loading courses:', err);
                classesGrid.innerHTML = `<div class="col-span-full text-center py-12"><p class="text-navy/50">Unable to load classes. Please refresh.</p></div>`;
            });
    }
}

function renderEmptyEvents(container, isError = false) {
    container.innerHTML = `
        <div class="reveal bg-gradient-to-br from-lavender/30 to-mint/30 p-8 rounded-3xl border-2 border-navy text-center">
            <span class="material-symbols-outlined text-navy/30 text-6xl mb-4">event_upcoming</span>
            <h3 class="text-navy text-xl font-bold mb-2">${isError ? 'Oops!' : 'Stay Tuned!'}</h3>
            <p class="text-navy/70 mb-6">${isError ? 'Failed to load events.' : 'We\'re planning exciting new events.'}</p>
            <a href="https://wa.link/a0lxj5" target="_blank" class="inline-flex items-center gap-2 bg-accent text-navy px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                <span class="material-symbols-outlined text-sm">notifications_active</span> Get Notified
            </a>
        </div>`;
}

function renderEvents(container, events) {
    container.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-6';
    container.innerHTML = '';

    events.forEach((ev, index) => {
        const [title, dateStr, time, location, price, desc, waLink, status] = ev;
        const delay = index * 100; // Staggered delay

        const eventCard = document.createElement('div');
        eventCard.className = `reveal group bg-white rounded-[2rem] p-8 border-2 border-navy/5 hover:border-accent hover:shadow-[8px_8px_0px_0px_rgba(78,205,196,0.3)] transition-all duration-300 flex flex-col h-full relative overflow-hidden`;
        eventCard.style.transitionDelay = `${delay}ms`;

        eventCard.innerHTML = `
            <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            
            <div class="relative z-10 flex flex-col h-full">
                <div class="flex justify-between items-start mb-6">
                <div class="flex flex-wrap gap-2">
                    ${status ? `<span class="bg-navy text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">${status}</span>` : ''}
                    <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Workshop</span>
                </div>
                </div>
                
                <h3 class="text-2xl font-black text-navy mb-4 leading-tight group-hover:text-primary transition-colors">${title || 'Upcoming Event'}</h3>
                
                <div class="space-y-3 mb-6">
                ${dateStr ? `
                <div class="flex items-center gap-3 text-navy/70">
                    <div class="w-10 h-10 rounded-full bg-lavender/30 flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-navy">calendar_month</span>
                    </div>
                    <div>
                    <p class="text-xs font-bold uppercase tracking-wider opacity-60">Date</p>
                    <p class="font-bold text-sm">${dateStr}</p>
                    </div>
                </div>` : ''}
                
                ${time ? `
                <div class="flex items-center gap-3 text-navy/70">
                    <div class="w-10 h-10 rounded-full bg-mint/30 flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-navy">schedule</span>
                    </div>
                    <div>
                    <p class="text-xs font-bold uppercase tracking-wider opacity-60">Time</p>
                    <p class="font-bold text-sm">${time}</p>
                    </div>
                </div>` : ''}

                ${location ? `
                <div class="flex items-center gap-3 text-navy/70">
                    <div class="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-navy">location_on</span>
                    </div>
                    <div>
                    <p class="text-xs font-bold uppercase tracking-wider opacity-60">Location</p>
                    <p class="font-bold text-sm">${location}</p>
                    </div>
                </div>` : ''}
                </div>
                
                <div class="mb-8 p-4 bg-cream rounded-2xl border border-navy/5">
                <p class="text-navy/70 text-sm leading-relaxed line-clamp-3">${desc || 'Join us for this transformative session.'}</p>
                </div>
                
                <div class="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-navy/5">
                <div>
                    <p class="text-xs font-bold uppercase tracking-wider text-navy/50">Investment</p>
                    <p class="text-xl font-black text-primary">${price ? `₹${price}` : 'Free'}</p>
                </div>
                <a href="${waLink || 'https://wa.link/a0lxj5'}" target="_blank" class="bg-navy text-white px-6 py-3 rounded-xl font-bold hover:bg-accent hover:text-navy transition-colors flex items-center gap-2 overflow-hidden relative ripple-btn">
                    Register <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
                </div>
            </div>
        `;
        container.appendChild(eventCard);
        if (revealObserver) revealObserver.observe(eventCard);
    });
}

function renderClasses(container, courses) {
    container.innerHTML = '';

    courses.forEach((course, index) => {
        // Map columns: 0:id, 1:title, 2:desc, 3:img, 4:price, 5:duration, 6:category, 7:tags, 8:features, 9:link
        const [id, title, desc, imgUrl, price, duration, categoryRaw, tagsRaw, features, waLink] = course;
        const delay = index * 50;

        const category = String(categoryRaw || '').toLowerCase().trim().replace(/\s+/g, '-');
        const tags = String(tagsRaw || '').toLowerCase().split(',').map(t => t.trim().replace(/\s+/g, '-')).join(' ');
        const combinedCategories = `${category} ${tags}`;

        // Determine gradients
        let bgClass = 'bg-gradient-to-br from-primary/10 to-lavender/30';
        if (combinedCategories.includes('meditation')) bgClass = 'bg-gradient-to-br from-mint/30 to-accent/10';
        if (combinedCategories.includes('fitness')) bgClass = 'bg-gradient-to-br from-lavender/30 to-primary/10';
        if (combinedCategories.includes('kids') || combinedCategories.includes('youth')) bgClass = 'bg-gradient-to-br from-primary/15 to-lavender/20';
        if (combinedCategories.includes('therapy')) bgClass = 'bg-gradient-to-br from-mint/30 to-accent/20';
        if (combinedCategories.includes('advanced') || combinedCategories.includes('advance')) bgClass = 'bg-gradient-to-br from-navy/10 to-lavender/20';

        // Image handling skeleton
        let imageHtml = '';
        const loadingClass = "skeleton"; // Use the skeleton class we added in css

        if (imgUrl && imgUrl.startsWith('assets/')) {
            imageHtml = `
            <div class="relative w-full h-40 rounded-2xl mb-4 overflow-hidden">
                <img alt="${title}" loading="lazy" class="w-full h-full object-cover relative z-10 transition-opacity duration-300 opacity-0" 
                     src="${imgUrl}" onload="this.classList.remove('opacity-0'); this.previousElementSibling?.remove()"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                <div class="absolute inset-0 z-0 ${loadingClass}"></div>
                <div style="display:none" class="w-full h-full bg-white/50 items-center justify-center absolute top-0 left-0"><span class="material-symbols-outlined text-navy/30 text-6xl">spa</span></div>
            </div>`;
        } else {
            // Fallback icon
            let icon = 'spa';
            if (combinedCategories.includes('kids')) icon = 'child_care';
            if (combinedCategories.includes('senior')) icon = 'elderly';
            if (combinedCategories.includes('therapy')) icon = 'healing';
            if (combinedCategories.includes('fitness')) icon = 'fitness_center';
            imageHtml = `<div class="w-full h-40 bg-white/50 rounded-2xl mb-4 flex items-center justify-center"><span class="material-symbols-outlined text-navy/30 text-6xl">${icon}</span></div>`;
        }

        const detailsUrl = id === 'slim-smart-sadhana' ? 'slim-smart-sadhana.html' : 'https://wa.link/a0lxj5';
        const detailsText = id === 'slim-smart-sadhana' ? 'Details' : 'Contact';
        const isDetailsPage = id === 'slim-smart-sadhana';

        const card = document.createElement('div');
        card.className = `reveal service-card ${bgClass} p-6 rounded-3xl border-b-4 border-r-4 border-navy hover:-translate-y-2 transition-all`;
        card.setAttribute('data-category', combinedCategories);
        card.style.transitionDelay = `${delay}ms`;

        card.innerHTML = `
            ${imageHtml}
            <div class="flex gap-2 mb-3">
            <span class="bg-white/80 text-navy px-2 py-0.5 rounded-full text-xs font-bold shadow-sm capitalize">${category || 'General'}</span>
            </div>
            <h3 class="text-navy text-xl font-bold mb-1">${title}</h3>
            <p class="text-primary font-bold mb-2">₹${price}<span class="text-navy/50 text-sm">/${duration || 'course'}</span></p>
            <p class="text-navy/70 text-sm mb-4 line-clamp-2">${desc || ''}</p>
            <div class="flex gap-2">
            <a href="${waLink || 'https://wa.link/a0lxj5'}" target="_blank" class="ripple-btn flex-1 bg-primary text-white py-2 rounded-xl text-sm font-bold text-center hover:shadow-lg transition-all relative overflow-hidden">Join</a>
            ${isDetailsPage ? `<a href="${detailsUrl}" class="flex-1 border-2 border-navy py-2 rounded-xl text-sm font-bold text-center hover:bg-navy hover:text-white transition-all">${detailsText}</a>` : ''}
            </div>
        `;
        container.appendChild(card);
        if (revealObserver) revealObserver.observe(card);
    });

    // Re-attach filter listeners
    initFilters();
}

function initFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(filter => {
        // Clone to remove old listeners if any (simple way to avoid dupes)
        const newFooter = filter.cloneNode(true);
        filter.parentNode.replaceChild(newFooter, filter);
    });

    const newFilters = document.querySelectorAll('.filter-btn');
    newFilters.forEach(filter => {
        filter.addEventListener('click', function () {
            const cards = document.querySelectorAll('.service-card');
            newFilters.forEach(f => {
                f.classList.remove('bg-navy', 'text-white', 'shadow-md');
                f.classList.add('bg-white', 'text-navy');
            });
            this.classList.remove('bg-white', 'text-navy');
            this.classList.add('bg-navy', 'text-white', 'shadow-md');

            const filterValue = this.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category.includes(filterValue)) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('active'), 50); // Re-trigger reveal
                } else {
                    card.style.display = 'none';
                    card.classList.remove('active');
                }
            });
        });
    });
}

/* --- 7. Button Ripple Effect --- */
function initRippleEffect() {
    document.addEventListener('click', function (e) {
        const target = e.target.closest('.ripple-btn');
        if (target) {
            const rect = target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const circle = document.createElement('span');
            const diameter = Math.max(rect.width, rect.height);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${x - radius}px`;
            circle.style.top = `${y - radius}px`;
            circle.classList.add('ripple');

            const ripple = target.getElementsByClassName('ripple')[0];
            if (ripple) {
                ripple.remove();
            }

            target.appendChild(circle);
        }
    });
}

function initParallax() {
    window.addEventListener('scroll', function () {
        const parallaxEls = document.querySelectorAll('.parallax-scroll');
        parallaxEls.forEach(el => {
            const speed = el.getAttribute('data-speed') || 0.5;
            const rect = el.getBoundingClientRect();
            // Only animate if in view
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const offset = window.pageYOffset * speed;
                el.style.transform = `translateY(${offset * 0.1}px)`;
            }
        });
    });
}
