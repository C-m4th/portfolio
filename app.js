/* =============================================
   CHAMATH FERNANDO — Portfolio JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initParticles();
    initScrollAnimations();
    initSkillBars();
    initProjectFilter();
    initExperienceAccordion();
    initContactForm();
    initScrollToTop();
});

/* ---------- NAVIGATION ---------- */
function initNav() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const allLinks = document.querySelectorAll('.nav-link');

    // Scroll: add .scrolled
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        highlightActiveSection();
    });

    // Mobile toggle
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        links.classList.toggle('open');
        document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    allLinks.forEach(l => l.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
        document.body.style.overflow = '';
    }));

    // Close on outside click
    document.addEventListener('click', e => {
        if (!links.contains(e.target) && !toggle.contains(e.target)) {
            toggle.classList.remove('open');
            links.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(sec => {
        const top = sec.offsetTop - 160;
        if (window.scrollY >= top) current = sec.id;
    });

    navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
}

/* ---------- PARTICLE CANVAS ---------- */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const COUNT = 55;

    function resize() {
        w = canvas.width = canvas.parentElement.offsetWidth;
        h = canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.r = Math.random() * 1.6 + .4;
            this.vx = (Math.random() - .5) * .3;
            this.vy = (Math.random() - .5) * .3;
            this.alpha = Math.random() * .35 + .05;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(94,234,212,${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function loop() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });

        // Draw lines between close particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(94,234,212,${.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = .5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(loop);
    }
    loop();
}

/* ---------- SCROLL ANIMATIONS ---------- */
function initScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('vis');
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

    const targets = document.querySelectorAll(
        '.about-layout, .about-photo-frame, .about-text-col, .about-objective, ' +
        '.edu-card, .expertise-card, .code-decoration, ' +
        '.skill-tile, .soft-card, .proj-card, .exp-item, ' +
        '.cv-layout, .contact-left, .contact-right'
    );

    targets.forEach((el, i) => {
        el.classList.add('fade-up');
        el.style.transitionDelay = `${(i % 6) * 80}ms`;
        observer.observe(el);
    });
}

/* ---------- SKILL BARS ---------- */
function initSkillBars() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('anim');
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-tile').forEach(t => observer.observe(t));
}

/* ---------- PROJECT FILTER ---------- */
function initProjectFilter() {
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.proj-card');

    btns.forEach(btn => btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        cards.forEach(card => {
            const match = filter === 'all' || card.dataset.cat === filter;
            card.classList.toggle('hidden', !match);
            if (match) {
                card.style.animation = 'none';
                card.offsetHeight; // reflow
                card.style.animation = '';
            }
        });
    }));
}

/* ---------- MODAL ---------- */
const projectInfo = {
    'game-bot': {
        title: 'Free Game Alert Bot',
        cat: 'Automation • Python & Meta APIs',
        img: 'assets/images/game-alert-bot.png',
        html: `
            <h4>Problem</h4>
            <p>PC gamers often miss limited-time free game promotions on Steam and Epic Games Store because deal notifications are scattered across disparate forums and websites.</p>
            <h4>Solution & Architecture</h4>
            <p>Built an automated cross-platform Python bot that continuously monitors RSS deal feeds, extracts key deal metadata (title, original price, discount period, claims URL), and automatically broadcasts rich media posts simultaneously across Facebook Pages, Instagram Business grids, and WhatsApp subscriber lists.</p>
            <h4>Key Technical Capabilities</h4>
            <ul>
                <li>Automated RSS feed scraping and deduplication via Python <code>feedparser</code></li>
                <li>Facebook Graph API integration to generate photo posts with custom deal links</li>
                <li>Instagram Business API integration using container creation & publishing workflow</li>
                <li>WhatsApp Business Cloud API to dispatch template notifications to subscriber groups</li>
                <li>Long-term unattended server deployment utilizing permanent Meta System User Access Tokens</li>
            </ul>`,
        tags: ['Python', 'feedparser', 'Meta Graph API', 'Instagram API', 'WhatsApp Cloud API']
    },
    'waste': {
        title: 'Smart Waste Management System',
        cat: 'Desktop Application • C# & SQL',
        img: 'assets/images/waste-management.png',
        html: `
            <h4>Problem</h4>
            <p>Inefficient waste collection processes lead to overflowing bins, missed pickups, and wasted resources. A smart system was needed to monitor waste levels and optimize collection routes.</p>
            <h4>My Contribution</h4>
            <ul>
                <li>Designed and developed the complete desktop application using C# (.NET)</li>
                <li>Implemented SQL database for tracking waste bin data, collection schedules, and routes</li>
                <li>Built a dashboard interface for real-time monitoring of waste bin fill levels</li>
                <li>Created data visualization components for analytics and reporting</li>
                <li>Implemented CRUD operations for managing bin locations and collection schedules</li>
            </ul>`,
        tags: ['C#', '.NET Framework', 'SQL Server', 'WinForms', 'Visual Studio']
    },
    'ultra': {
        title: 'Ultra Computers',
        cat: 'Web Development • HTML, CSS & JS',
        img: 'assets/images/ultra-computers.png',
        html: `
            <h4>Problem</h4>
            <p>A local computer store needed an online presence to showcase their products, provide specifications, and enable customers to browse inventory from anywhere.</p>
            <h4>My Contribution</h4>
            <ul>
                <li>Designed and developed a fully responsive e-commerce website</li>
                <li>Created product catalog pages with detailed specifications and pricing</li>
                <li>Implemented interactive UI elements including product filters and search functionality</li>
                <li>Built a responsive navigation system and mobile-friendly layout</li>
                <li>Applied modern CSS techniques including Flexbox and Grid for layouts</li>
            </ul>`,
        tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Git']
    },
    'clothing': {
        title: 'Clothing Store — UI/UX Design',
        cat: 'UI/UX Design • Figma',
        img: 'assets/images/clothing-store.png',
        html: `
            <h4>Problem</h4>
            <p>A clothing retailer needed a modern, user-friendly mobile app design with intuitive product browsing and smooth checkout flow.</p>
            <h4>My Contribution</h4>
            <ul>
                <li>Created comprehensive UI/UX design from wireframes to high-fidelity mockups</li>
                <li>Designed the complete user flow including product browsing, cart, and checkout screens</li>
                <li>Developed a cohesive visual design system with consistent typography and color palette</li>
                <li>Applied UX best practices for mobile shopping experience</li>
                <li>Created interactive prototypes for user testing and stakeholder presentations</li>
            </ul>`,
        tags: ['Figma', 'UI/UX Design', 'Prototyping', 'Design Systems', 'User Research']
    }
};

function openModal(id) {
    const data = projectInfo[id];
    if (!data) return;
    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <img src="${data.img}" alt="${data.title}">
        <h2>${data.title}</h2>
        <p class="modal-cat">${data.cat}</p>
        ${data.html}
        <div class="modal-tags">${data.tags.map(t => `<span class="modal-tag">${t}</span>`).join('')}</div>
    `;
    document.getElementById('modal-backdrop').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal-backdrop').classList.remove('open');
    document.body.style.overflow = '';
}

// Close on backdrop click
document.getElementById('modal-backdrop')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
});
// Close on Escape
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ---------- EXPERIENCE ACCORDION ---------- */
function initExperienceAccordion() {
    // Open first item by default
    const first = document.querySelector('.exp-item');
    if (first) {
        const body = first.querySelector('.exp-body');
        const icon = first.querySelector('.exp-plus i');
        if (body) body.classList.add('open');
        if (icon) { icon.classList.remove('fa-plus'); icon.classList.add('fa-minus'); }
    }
}

function toggleExp(bar) {
    const item = bar.closest('.exp-item');
    const body = item.querySelector('.exp-body');
    const icon = item.querySelector('.exp-plus i');

    // Close all others
    document.querySelectorAll('.exp-body').forEach(b => {
        if (b !== body) {
            b.classList.remove('open');
            const otherIcon = b.closest('.exp-item').querySelector('.exp-plus i');
            if (otherIcon) { otherIcon.classList.remove('fa-minus'); otherIcon.classList.add('fa-plus'); }
        }
    });

    // Toggle
    body.classList.toggle('open');
    if (body.classList.contains('open')) {
        icon.classList.remove('fa-plus'); icon.classList.add('fa-minus');
    } else {
        icon.classList.remove('fa-minus'); icon.classList.add('fa-plus');
    }
}

/* ---------- CONTACT FORM ---------- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('.btn-send');
        const orig = btn.innerHTML;
        btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
        btn.style.background = 'linear-gradient(135deg, #10b981, #5eead4)';
        setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; form.reset(); }, 3000);
    });
}

/* ---------- SCROLL TO TOP ---------- */
function initScrollToTop() {
    const btn = document.getElementById('go-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 500);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
