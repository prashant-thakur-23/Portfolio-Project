const CONFIG = {
    particleCount: 50,
    particleCountMobile: 15,
    toastDuration: 5000,
    cacheExpiry: 5 * 60 * 1000,
    maxRetries: 3
};

const state = {
    isDark: localStorage.getItem('theme') === 'dark' || 
            (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches),
    isMenuOpen: false,
    lastScrollY: 0,
    isScrolling: false,
    currentFilter: 'all',
    searchQuery: ''
};

const PROJECTS = [
    {
        title: 'To-Do List',
        desc: 'Task manager with local storage — add, delete, mark complete',
        tech: ['HTML5', 'CSS3', 'JavaScript'],
        category: 'javascript html-css',
        icon: '✅',
        github: 'https://github.com/Prashant-thakur-23/todo-list'
    },
    {
        title: 'Calculator',
        desc: 'Fully functional calculator with keyboard support',
        tech: ['HTML5', 'CSS3', 'JavaScript'],
        category: 'javascript html-css',
        icon: '🔢',
        github: 'https://github.com/Prashant-thakur-23/calculator'
    },
    {
        title: 'Duplication Table Generator',
        desc: 'Dynamic multiplication table with custom range input',
        tech: ['HTML5', 'CSS3', 'JavaScript'],
        category: 'javascript html-css',
        icon: '📋',
        github: 'https://github.com/Prashant-thakur-23/table-generator'
    },
    {
        title: 'Currency Converter',
        desc: 'Real-time currency conversion using exchange rate API',
        tech: ['HTML5', 'CSS3', 'JavaScript', 'API'],
        category: 'javascript',
        icon: '💰',
        github: 'https://github.com/Prashant-thakur-23/currency-converter'
    },
    {
        title: 'Digital Clock',
        desc: 'Live clock with multiple theme options',
        tech: ['HTML5', 'CSS3', 'JavaScript'],
        category: 'javascript html-css',
        icon: '🕒',
        github: 'https://github.com/Prashant-thakur-23/digital-clock'
    },
    {
        title: 'ATM Machine Simulation',
        desc: 'Console-based banking system with OOP in Java',
        tech: ['Java', 'OOP'],
        category: 'java',
        icon: '🏧',
        github: 'https://github.com/Prashant-thakur-23/atm-simulation'
    },
    {
        title: 'Cricket Ground Booking',
        desc: 'Ground slot booking interface with availability check',
        tech: ['Java', 'OOP'],
        category: 'java',
        icon: '🏏',
        github: 'https://github.com/Prashant-thakur-23/cricket-booking'
    },
    {
        title: 'Expense Tracker',
        desc: 'Personal finance tracker with category-wise filtering',
        tech: ['HTML5', 'CSS3', 'JavaScript'],
        category: 'javascript',
        icon: '💸',
        github: 'https://github.com/Prashant-thakur-23/expense-tracker'
    },
    {
        title: 'QR Code Generator',
        desc: 'Generate custom QR codes with size and color options',
        tech: ['HTML5', 'CSS3', 'JavaScript', 'API'],
        category: 'javascript html-css',
        icon: '📱',
        github: 'https://github.com/Prashant-thakur-23/qr-generator'
    },
    {
        title: 'Rock Paper Scissors',
        desc: 'Interactive game with score tracking and animations',
        tech: ['HTML5', 'CSS3', 'JavaScript'],
        category: 'javascript html-css',
        icon: '✊',
        github: 'https://github.com/Prashant-thakur-23/rock-paper-scissors'
    },
    {
        title: 'Traffic Signal Simulation',
        desc: 'Realistic traffic light with timing control',
        tech: ['HTML5', 'CSS3', 'JavaScript'],
        category: 'javascript html-css',
        icon: '🚦',
        github: 'https://github.com/Prashant-thakur-23/traffic-signal'
    }
];

const LANGUAGE_COLORS = {
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Java: '#b07219',
    HTML: '#e34c26',
    CSS: '#563d7c',
    'C++': '#f34b7d',
    'C#': '#178600',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    TypeScript: '#3178c6',
    PHP: '#4F5D95',
    Kotlin: '#F18E33',
    Dart: '#00B4AB',
    Shell: '#89e051',
    Vue: '#41b883',
    Angular: '#dd0031'
};

const DOM = {
    navbar: document.getElementById('navbar'),
    navLinks: document.getElementById('navLinks'),
    mobileBtn: document.getElementById('mobileMenuBtn'),
    themeToggle: document.getElementById('themeToggle'),
    scrollProgress: document.getElementById('scrollProgress'),
    canvas: document.getElementById('bgCanvas'),
    glow: document.getElementById('mouseGlow'),
    contactForm: document.getElementById('contactForm'),
    githubProfile: document.getElementById('githubProfile'),
    githubRepos: document.getElementById('githubReposGrid'),
    languagesContainer: document.getElementById('languagesContainer'),
    projectsGrid: document.getElementById('projectsGrid')
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
    el.classList.add('observed');
    observer.observe(el);
});

window.projectObserver = observer;

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.isPaused = false;
        this.resize();
        this.initParticles();
        this.animate();
        this.setupResize();
        this.setupVisibility();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    initParticles() {
        const count = window.innerWidth < 768 ? CONFIG.particleCountMobile : CONFIG.particleCount;
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        if (this.isPaused) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(184, 155, 122, ${p.alpha})`;
            this.ctx.fill();
        });
        this.drawConnections();
        requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(184, 155, 122, ${0.1 * (1 - dist / 150)})`;
                    this.ctx.stroke();
                }
            }
        }
    }

    setupResize() {
        let timer;
        window.addEventListener('resize', () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.resize();
                this.initParticles();
            }, 250);
        });
    }

    setupVisibility() {
        document.addEventListener('visibilitychange', () => {
            this.isPaused = document.hidden;
        });
    }
}

class TypingAnimation {
    constructor(element, phrases) {
        this.element = element;
        this.phrases = phrases;
        this.currentPhrase = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.speed = 100;
    }

    start() {
        this.type();
    }

    type() {
        const current = this.phrases[this.currentPhrase];
        if (this.isDeleting) {
            this.element.textContent = current.substring(0, this.charIndex - 1);
            this.charIndex--;
            this.speed = 50;
        } else {
            this.element.textContent = current.substring(0, this.charIndex + 1);
            this.charIndex++;
            this.speed = 100;
        }
        if (!this.isDeleting && this.charIndex === current.length) {
            this.speed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
            this.speed = 500;
        }
        setTimeout(() => this.type(), this.speed);
    }
}

class GitHubManager {
    constructor() {
        this.username = 'Prashant-thakur-23';
        this.baseUrl = 'https://api.github.com';
        this.cacheKey = 'github_data';
        this.retryCount = 0;
    }

    async init() {
        await this.fetchAllData();
    }

    async fetchAllData() {
        try {
            const cached = this.getCachedData();
            if (cached) {
                this.renderProfile(cached.profile);
                this.renderRepos(cached.repos);
                this.renderLanguages(cached.languages);
                this.renderStats(cached.profile);
                return;
            }
            this.showSkeletons();
            const [profile, repos, languages] = await Promise.all([
                this.fetchProfile(),
                this.fetchRepos(),
                this.fetchLanguages()
            ]);
            this.cacheData({ profile, repos, languages });
            this.renderProfile(profile);
            this.renderRepos(repos);
            this.renderLanguages(languages);
            this.renderStats(profile);
        } catch (error) {
            if (this.retryCount < CONFIG.maxRetries) {
                this.retryCount++;
                setTimeout(() => this.fetchAllData(), Math.pow(2, this.retryCount) * 1000);
                return;
            }
            this.showError();
        }
    }

    getCachedData() {
        try {
            const cached = sessionStorage.getItem(this.cacheKey);
            if (!cached) return null;
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp > CONFIG.cacheExpiry) {
                sessionStorage.removeItem(this.cacheKey);
                return null;
            }
            return data;
        } catch {
            return null;
        }
    }

    cacheData(data) {
        try {
            sessionStorage.setItem(this.cacheKey, JSON.stringify({
                timestamp: Date.now(),
                data
            }));
        } catch {}
    }

    async fetchProfile() {
        const res = await fetch(`${this.baseUrl}/users/${this.username}`);
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        return await res.json();
    }

    async fetchRepos() {
        const res = await fetch(`${this.baseUrl}/users/${this.username}/repos?sort=updated&per_page=12`);
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
        return await res.json();
    }

    async fetchLanguages() {
        const repos = await this.fetchRepos();
        const promises = repos.map(async (repo) => {
            const res = await fetch(repo.languages_url);
            if (!res.ok) return {};
            return await res.json();
        });
        const data = await Promise.all(promises);
        const aggregated = {};
        data.forEach(langData => {
            Object.entries(langData).forEach(([lang, bytes]) => {
                aggregated[lang] = (aggregated[lang] || 0) + bytes;
            });
        });
        const total = Object.values(aggregated).reduce((a, b) => a + b, 0);
        return Object.entries(aggregated)
            .sort((a, b) => b[1] - a[1])
            .map(([name, bytes]) => ({
                name,
                percentage: (bytes / total) * 100,
                bytes
            }));
    }

    showSkeletons() {
        if (DOM.githubProfile) {
            DOM.githubProfile.innerHTML = '<div class="skeleton-profile"></div>';
        }
        if (DOM.githubRepos) {
            DOM.githubRepos.innerHTML = Array(6).fill(0)
                .map(() => '<div class="skeleton-repo"></div>')
                .join('');
        }
        if (DOM.languagesContainer) {
            DOM.languagesContainer.innerHTML = Array(4).fill(0)
                .map(() => '<div class="skeleton-bar"></div>')
                .join('');
        }
    }

    showError() {
        if (DOM.githubProfile) {
            DOM.githubProfile.innerHTML = `
                <div class="error-state">
                    <p>Unable to load GitHub data. Please try again.</p>
                    <button onclick="window.githubManager.init()" class="btn btn-primary">Retry</button>
                </div>
            `;
        }
        if (DOM.githubRepos) {
            DOM.githubRepos.innerHTML = `<div class="error-state"><p>Unable to load repositories.</p></div>`;
        }
    }

   renderProfile(profile) {
    if (!DOM.githubProfile) return;
    const avatarUrl = 'profile.jpeg';
    DOM.githubProfile.innerHTML = `
        <div class="gh-profile-card">
            <div class="gh-avatar-large">
                <img src="${avatarUrl}" alt="${profile.name || this.username}" loading="lazy">
            </div>
            <div class="gh-profile-info">
                <h3>${profile.name || this.username}</h3>
                <p>${profile.bio || 'Software Developer'}</p>
                <div class="gh-profile-meta">
                    ${profile.location ? `<span>📍 ${profile.location}</span>` : ''}
                    ${profile.company ? `<span>🏢 ${profile.company}</span>` : ''}
                    ${profile.blog ? `<span>🌐 <a href="${profile.blog}" target="_blank" rel="noopener noreferrer">${profile.blog}</a></span>` : ''}
                </div>
                <div class="gh-stats-detailed">
                    <div><strong>${profile.public_repos || 0}</strong><span>Repos</span></div>
                    <div><strong>${profile.followers || 0}</strong><span>Followers</span></div>
                    <div><strong>${profile.following || 0}</strong><span>Following</span></div>
                </div>
            </div>
        </div>
    `;
}

    renderRepos(repos) {
        if (!DOM.githubRepos) return;
        if (!repos || repos.length === 0) {
            DOM.githubRepos.innerHTML = '<p class="empty-state">No public repositories found.</p>';
            return;
        }
        const fragment = document.createDocumentFragment();
        repos.forEach((repo, index) => {
            const card = document.createElement('div');
            card.className = 'repo-card reveal';
            card.style.transitionDelay = `${index * 0.1}s`;
            const daysAgo = this.getDaysAgo(repo.updated_at);
            const langColor = this.getLanguageColor(repo.language);
            card.innerHTML = `
                <h4><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h4>
                <p>${repo.description || 'No description provided'}</p>
                <div class="repo-meta">
                    ${repo.language ? `<span><span class="repo-lang-color" style="background: ${langColor}"></span>${repo.language}</span>` : ''}
                    ${repo.stargazers_count > 0 ? `<span>⭐ ${repo.stargazers_count}</span>` : ''}
                    ${repo.forks_count > 0 ? `<span>🍴 ${repo.forks_count}</span>` : ''}
                    <span>🕐 ${daysAgo}</span>
                </div>
            `;
            fragment.appendChild(card);
        });
        DOM.githubRepos.innerHTML = '';
        DOM.githubRepos.appendChild(fragment);
        DOM.githubRepos.querySelectorAll('.repo-card').forEach((card, i) => {
            setTimeout(() => observer.observe(card), i * 100);
        });
    }

    renderLanguages(languages) {
        if (!DOM.languagesContainer) return;
        if (!languages || languages.length === 0) {
            DOM.languagesContainer.innerHTML = '<p>No language data available.</p>';
            return;
        }
        const fragment = document.createDocumentFragment();
        languages.forEach((lang, index) => {
            const bar = document.createElement('div');
            bar.className = 'language-bar reveal';
            bar.style.transitionDelay = `${index * 0.1}s`;
            const color = this.getLanguageColor(lang.name);
            bar.innerHTML = `
                <span class="lang-color" style="background: ${color}"></span>
                <span class="lang-name">${lang.name}</span>
                <span class="lang-percent">${lang.percentage.toFixed(1)}%</span>
            `;
            fragment.appendChild(bar);
        });
        DOM.languagesContainer.innerHTML = '';
        DOM.languagesContainer.appendChild(fragment);
        DOM.languagesContainer.querySelectorAll('.language-bar').forEach((bar, i) => {
            setTimeout(() => observer.observe(bar), i * 100);
        });
    }

    renderStats(profile) {
        const elements = {
            repoCount: profile.public_repos || 0,
            followerCount: profile.followers || 0,
            followingCount: profile.following || 0
        };
        Object.entries(elements).forEach(([id, target]) => {
            const el = document.getElementById(id);
            if (!el) return;
            const duration = 1500;
            const start = performance.now();
            const update = (time) => {
                const progress = Math.min((time - start) / duration, 1);
                el.textContent = Math.round(progress * target);
                if (progress < 1) requestAnimationFrame(update);
                else el.textContent = target;
            };
            requestAnimationFrame(update);
        });
    }

    getDaysAgo(dateString) {
        const diff = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Yesterday';
        if (diff < 7) return `${diff} days ago`;
        if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
        if (diff < 365) return `${Math.floor(diff / 30)} months ago`;
        return `${Math.floor(diff / 365)} years ago`;
    }

    getLanguageColor(language) {
        return LANGUAGE_COLORS[language] || '#cccccc';
    }
}

class ProjectsManager {
    constructor() {
        this.projects = PROJECTS;
        this.currentFilter = 'all';
        this.searchQuery = '';
    }

    init() {
        this.setupFilters();
        this.setupSearch();
        this.renderProjects();
    }

    setupFilters() {
        const btns = document.querySelectorAll('.filter-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderProjects();
            });
        });
    }

    setupSearch() {
        const filterBar = document.querySelector('.filter-bar');
        const container = document.createElement('div');
        container.className = 'search-container';
        container.innerHTML = `<input type="text" id="projectSearch" placeholder="Search projects..." class="search-input">`;
        filterBar.parentNode.insertBefore(container, filterBar.nextSibling);
        const input = document.getElementById('projectSearch');
        let timer;
        input.addEventListener('input', (e) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.renderProjects();
            }, 300);
        });
    }

    getFilteredProjects() {
        let filtered = this.projects;
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(p => p.category.includes(this.currentFilter));
        }
        if (this.searchQuery) {
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(this.searchQuery) ||
                p.desc.toLowerCase().includes(this.searchQuery) ||
                p.tech.some(t => t.toLowerCase().includes(this.searchQuery))
            );
        }
        return filtered;
    }

    renderProjects() {
        if (!DOM.projectsGrid) return;
        const filtered = this.getFilteredProjects();
        if (filtered.length === 0) {
            DOM.projectsGrid.innerHTML = `<div class="empty-state"><p>No projects found matching your criteria.</p></div>`;
            return;
        }
        const fragment = document.createDocumentFragment();
        filtered.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card reveal';
            card.style.transitionDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="project-icon">${project.icon}</div>
                <h3>${project.title}</h3>
                <p>${project.desc}</p>
                <div class="project-tech">${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
                <div class="project-links">
                    <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link">GitHub →</a>
                </div>
            `;
            fragment.appendChild(card);
        });
        DOM.projectsGrid.innerHTML = '';
        DOM.projectsGrid.appendChild(fragment);
        DOM.projectsGrid.querySelectorAll('.project-card').forEach((card, i) => {
            setTimeout(() => observer.observe(card), i * 100);
        });
        this.updateFilterCounts();
    }

    updateFilterCounts() {
        const btns = document.querySelectorAll('.filter-btn');
        btns.forEach(btn => {
            const filter = btn.dataset.filter;
            const count = filter === 'all' ? this.projects.length : this.projects.filter(p => p.category.includes(filter)).length;
            const label = btn.textContent.split('(')[0].trim();
            btn.textContent = `${label} (${count})`;
        });
    }
}

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    DOM.scrollProgress.style.width = `${progress}%`;
}

function handleNavbarScroll() {
    const current = window.scrollY;
    if (current > 100) {
        DOM.navbar.classList.toggle('hidden', current > state.lastScrollY);
    } else {
        DOM.navbar.classList.remove('hidden');
    }
    state.lastScrollY = current;
}

function debouncedScroll() {
    if (state.isScrolling) return;
    state.isScrolling = true;
    requestAnimationFrame(() => {
        updateScrollProgress();
        handleNavbarScroll();
        state.isScrolling = false;
    });
}

function setupMouseGlow() {
    let timeout;
    document.addEventListener('mousemove', (e) => {
        DOM.glow.style.left = `${e.clientX}px`;
        DOM.glow.style.top = `${e.clientY}px`;
        DOM.glow.style.opacity = '0.15';
        clearTimeout(timeout);
        timeout = setTimeout(() => DOM.glow.style.opacity = '0', 3000);
    });
}

function toggleTheme() {
    state.isDark = !state.isDark;
    document.documentElement.classList.toggle('dark', state.isDark);
    localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
    DOM.themeToggle.textContent = state.isDark ? '☀️' : '🌙';
}

function setupThemeToggle() {
    DOM.themeToggle.textContent = state.isDark ? '☀️' : '🌙';
    DOM.themeToggle.addEventListener('click', toggleTheme);
}

function toggleMobileMenu() {
    state.isMenuOpen = !state.isMenuOpen;
    DOM.mobileBtn.classList.toggle('active', state.isMenuOpen);
    DOM.navLinks.classList.toggle('open', state.isMenuOpen);
    document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
}

function setupMobileMenu() {
    DOM.mobileBtn.addEventListener('click', toggleMobileMenu);
    DOM.navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (state.isMenuOpen) toggleMobileMenu();
        });
    });
    document.addEventListener('click', (e) => {
        if (state.isMenuOpen && !DOM.navbar.contains(e.target)) {
            toggleMobileMenu();
        }
    });
}

function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');
    let current = '';
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
            current = section.id;
        }
    });
    links.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormMessage(text, type) {
    const msg = document.getElementById('formMsg');
    msg.textContent = text;
    msg.className = `form-msg ${type}`;
    if (type === 'success') {
        setTimeout(() => {
            msg.textContent = '';
            msg.className = 'form-msg';
        }, 5000);
    }
}

function setupContactForm() {
    DOM.contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        const submitBtn = document.getElementById('submitBtn');
        if (!name || !email || !message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }
        if (message.length < 10) {
            showFormMessage('Message must be at least 10 characters.', 'error');
            return;
        }
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            DOM.contactForm.reset();
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }, 30000);
        } catch {
            showFormMessage('Failed to send message. Please try again.', 'error');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

function setupRippleEffect() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.toggle('dark', state.isDark);
    if (DOM.canvas) new ParticleSystem(DOM.canvas);
    setupMouseGlow();
    setupThemeToggle();
    setupMobileMenu();
    setupContactForm();
    setupRippleEffect();
    window.addEventListener('scroll', debouncedScroll, { passive: true });
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();
    const typing = document.getElementById('typing-text');
    if (typing) {
        new TypingAnimation(typing, ['CSE Student', 'Frontend Developer', 'Full Stack Engineer', 'AI Enthusiast']).start();
    }
    const github = new GitHubManager();
    window.githubManager = github;
    github.init();
    const projects = new ProjectsManager();
    projects.init();
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    node.querySelectorAll ? node.querySelectorAll('.reveal:not(.observed)').forEach(el => {
                        el.classList.add('observed');
                        observer.observe(el);
                    }) : null;
                }
            });
        });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
});