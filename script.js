// =============== SCROLL PROGRESS BAR ===============
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// =============== PARTICLE BACKGROUND ===============
const particleCanvas = document.getElementById('particleCanvas');
const ctx = particleCanvas.getContext('2d');

particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

let particlesArray = [];
let mouse = {
    x: null,
    y: null,
    radius: 150
};

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = 'rgba(0, 212, 255, 0.5)';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > particleCanvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > particleCanvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }

        // Mouse interaction
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            if (mouse.x < this.x && this.x < particleCanvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < particleCanvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    let numberOfParticles = (particleCanvas.width * particleCanvas.height) / 15000;
    for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * particleCanvas.width;
        let y = Math.random() * particleCanvas.height;
        particlesArray.push(new Particle(x, y));
    }
}

function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(0, 212, 255, ${1 - distance / 100})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    initParticles();
});

// =============== NAVIGATION ===============
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = navToggle.querySelector('i');
    icon.classList.toggle('uil-bars');
    icon.classList.toggle('uil-times');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = navToggle.querySelector('i');
        icon.classList.remove('uil-times');
        icon.classList.add('uil-bars');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active link on scroll
const sections = document.querySelectorAll('section[id]');

function activeLinkOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href*=${sectionId}]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', activeLinkOnScroll);

// =============== THEME TOGGLE ===============
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const html = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);

// Update icon based on current theme
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Update 3D scene colors if it exists
    if (window.updateSceneTheme) {
        window.updateSceneTheme(newTheme);
    }
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('uil-moon');
        themeIcon.classList.add('uil-sun');
    } else {
        themeIcon.classList.remove('uil-sun');
        themeIcon.classList.add('uil-moon');
    }
}

// =============== 3D SCENE WITH THREE.JS ===============
let scene, camera, renderer, sphere, particles;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function init3DScene() {
    const container = document.getElementById('canvasContainer');
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create main sphere with wireframe
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00d4ff,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Create particle system
    create3DParticles();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00d4ff, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xff6b6b, 0.8, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Mouse move listener
    document.addEventListener('mousemove', onDocumentMouseMove);

    // Start animation
    animate3D();
}

function create3DParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.8
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) / 100;
    mouseY = (event.clientY - windowHalfY) / 100;
}

function animate3D() {
    requestAnimationFrame(animate3D);

    // Smooth camera movement
    targetX = mouseX * 0.3;
    targetY = mouseY * 0.3;

    if (sphere) {
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        
        // Mouse interaction
        sphere.rotation.x += (targetY - sphere.rotation.x) * 0.05;
        sphere.rotation.y += (targetX - sphere.rotation.y) * 0.05;
    }

    if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
    }

    renderer.render(scene, camera);
}

// Update scene colors based on theme
window.updateSceneTheme = function(theme) {
    if (!sphere || !particles) return;

    const isDark = theme === 'dark';
    
    // Update sphere color
    sphere.material.color.setHex(isDark ? 0x00d4ff : 0x0099ff);
    
    // Update particles color
    particles.material.color.setHex(isDark ? 0x00d4ff : 0x0066cc);
    
    // Update background
    scene.background = isDark ? null : new THREE.Color(0xf8f9fa);
};

// Handle window resize
window.addEventListener('resize', () => {
    if (!camera || !renderer) return;
    
    const container = document.getElementById('canvasContainer');
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(containerWidth, containerHeight);
});

// Initialize 3D scene when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init3DScene();
});

// =============== TYPING ANIMATION ===============
const typingText = document.getElementById('typingText');
const roles = [
    'Front-End Developer',
    'UI/UX Enthusiast',
    'Creative Coder',
    'Problem Solver'
];

let roleIndex = 0;
let charIndexRole = 0;
let isDeletingRole = false;
let typingSpeed = 100;

function typeRole() {
    const currentRole = roles[roleIndex];

    if (isDeletingRole) {
        typingText.textContent = currentRole.substring(0, charIndexRole - 1);
        charIndexRole--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentRole.substring(0, charIndexRole + 1);
        charIndexRole++;
        typingSpeed = 100;
    }

    if (!isDeletingRole && charIndexRole === currentRole.length) {
        typingSpeed = 2000;
        isDeletingRole = true;
    } else if (isDeletingRole && charIndexRole === 0) {
        isDeletingRole = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
    }

    setTimeout(typeRole, typingSpeed);
}

// Start typing animation
setTimeout(typeRole, 1000);

// =============== SMOOTH SCROLLING ===============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// =============== GITHUB PROJECTS INTEGRATION ===============
const githubUsername = document.getElementById('githubUsername');
const loadGithubBtn = document.getElementById('loadGithubBtn');
const projectsGrid = document.getElementById('projectsGrid');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const githubInputWrapper = document.getElementById('githubInputWrapper');

// Auto-load projects on page load with default username
window.addEventListener('load', () => {
    if (githubUsername && githubUsername.value.trim()) {
        loadGithubProjects(githubUsername.value.trim());
    }
});

// Load projects on button click
if (loadGithubBtn) {
    loadGithubBtn.addEventListener('click', () => {
        const username = githubUsername.value.trim();
        if (username) {
            loadGithubProjects(username);
        }
    });
}

// Load projects on Enter key
if (githubUsername) {
    githubUsername.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const username = githubUsername.value.trim();
            if (username) {
                loadGithubProjects(username);
            }
        }
    });
}

let allProjects = [];

// Specific projects to display (from GitHub repo names)
const specificProjects = [
    'Eataly-Hub',
    'E-commerce-website',
    'Finance-Pulse-Money-Intelligence-Dashboard',
    'IT-Asset-Manager',
    'PathFinder-AI-The-Career-Architect-For-Next-Gen-Enigeers',
    'Tholakwande-Group'
];

async function loadGithubProjects(username) {
    // Show loading state
    loadingState.style.display = 'block';
    projectsGrid.innerHTML = '';
    emptyState.style.display = 'none';

    try {
        // Fetch repositories from GitHub API
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }

        const repos = await response.json();

        // Hide loading and input after successful fetch
        loadingState.style.display = 'none';
        githubInputWrapper.style.display = 'none';

        if (repos.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        // Filter to only show specific projects (case-insensitive matching)
        const filteredRepos = repos.filter(repo => 
            specificProjects.some(projectName => 
                repo.name.toLowerCase().replace(/-/g, '').replace(/_/g, '') === 
                projectName.toLowerCase().replace(/-/g, '').replace(/_/g, '')
            )
        );
        
        if (filteredRepos.length === 0) {
            // Show all repos if no specific projects found
            console.warn('No specific projects found. Displaying all repositories.');
            emptyState.innerHTML = `
                <i class="uil uil-info-circle"></i>
                <h3>Specific Projects Not Found</h3>
                <p>Could not find the specified projects. Please check your repository names.</p>
                <p style="margin-top: 1rem; font-size: 0.875rem;">Available repositories: ${repos.map(r => r.name).join(', ')}</p>
            `;
            emptyState.style.display = 'block';
            return;
        }

        allProjects = filteredRepos;

        // Display projects in the order they appear in specificProjects array
        filteredRepos.forEach((repo, index) => {
            const projectCard = createProjectCard(repo, index);
            projectsGrid.appendChild(projectCard);
        });

        // Animate cards
        animateProjectCards();

        console.log(`✅ Loaded ${filteredRepos.length} projects:`, filteredRepos.map(r => r.name));

    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        loadingState.style.display = 'none';
        emptyState.style.display = 'block';
        githubInputWrapper.style.display = 'block';
    }
}

async function loadProjectPreviews(repos) {
    // Preview images disabled - using gradient backgrounds instead
    return;
}

function createProjectCard(repo, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.dataset.language = repo.language?.toLowerCase() || 'other';
    card.dataset.name = repo.name.toLowerCase();

    // Get language or use default
    const language = repo.language || 'Code';
    
    // Get topics/tags
    const topics = repo.topics?.slice(0, 3) || [];
    
    // Truncate description
    const description = repo.description 
        ? (repo.description.length > 120 
            ? repo.description.substring(0, 120) + '...' 
            : repo.description)
        : 'A GitHub repository showcasing development skills and best practices.';

    // Format project name
    const projectName = repo.name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    card.innerHTML = `
        <div class="project-image">
            <i class="uil uil-code-branch"></i>
        </div>
        <div class="project-content">
            <h3>${projectName}</h3>
            <p>${description}</p>
            <div class="project-tags">
                <span class="project-tag">${language}</span>
                ${topics.map(topic => `<span class="project-tag">${topic}</span>`).join('')}
            </div>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
                    <i class="uil uil-github-alt"></i> Code
                </a>
                ${repo.homepage ? `
                    <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-link">
                        <i class="uil uil-external-link-alt"></i> Live Demo
                    </a>
                ` : ''}
            </div>
        </div>
    `;

    return card;
}

function animateProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => {
        observer.observe(card);
    });
}

// =============== PROJECT FILTERS ===============
const filterBtns = document.querySelectorAll('.filter-btn');
const projectSearch = document.getElementById('projectSearch');
const viewBtns = document.querySelectorAll('.view-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        filterProjects(filter, projectSearch ? projectSearch.value : '');
    });
});

if (projectSearch) {
    projectSearch.addEventListener('input', (e) => {
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        filterProjects(activeFilter, e.target.value);
    });
}

function filterProjects(filter, searchTerm) {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        const language = card.dataset.language;
        const name = card.dataset.name;
        
        const matchesFilter = filter === 'all' || language === filter || 
                            (filter === 'html' && (language === 'html' || language === 'css'));
        const matchesSearch = name.includes(searchTerm.toLowerCase());
        
        if (matchesFilter && matchesSearch) {
            card.classList.remove('hidden');
            card.style.display = 'block';
        } else {
            card.classList.add('hidden');
            card.style.display = 'none';
        }
    });
}

// View Toggle
viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const view = btn.dataset.view;
        if (view === 'grid') {
            projectsGrid.classList.remove('list-view');
            projectsGrid.classList.add('grid-view');
        } else {
            projectsGrid.classList.remove('grid-view');
            projectsGrid.classList.add('list-view');
        }
    });
});

// =============== SCROLL ANIMATIONS ===============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animate skill bars
            if (entry.target.classList.contains('skill-card')) {
                const progressBar = entry.target.querySelector('.skill-progress');
                if (progressBar) {
                    const width = progressBar.style.width;
                    progressBar.style.width = '0';
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 100);
                }
            }
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll(
    '.info-card, .skill-card, .service-card, .contact-method'
);

animateElements.forEach(el => {
    observer.observe(el);
});

// =============== CONTACT FORM ===============
// Initialize EmailJS
(function() {
    emailjs.init("NBIl-pPeDp_7kh6TX");
})();

const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const submitBtn = document.getElementById('submitBtn');
const messageTextarea = document.getElementById('message');
const charCount = document.getElementById('charCount');

// Character counter
if (messageTextarea && charCount) {
    messageTextarea.addEventListener('input', () => {
        const length = messageTextarea.value.length;
        charCount.textContent = length;
        
        if (length > 500) {
            messageTextarea.value = messageTextarea.value.substring(0, 500);
            charCount.textContent = 500;
        }
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate form
        let isValid = true;
        const formGroups = contactForm.querySelectorAll('.form-group');

        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            group.classList.remove('error');

            // Check if empty
            if (!input.value.trim()) {
                group.classList.add('error');
                isValid = false;
            }

            // Validate email
            if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    group.classList.add('error');
                    isValid = false;
                }
            }
        });

        // If valid, send email
        if (isValid) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Send email using EmailJS
            emailjs.sendForm('service_vbwhk0h', 'template_rea9kz6', contactForm)
                .then(() => {
                    successMessage.classList.add('show');
                    errorMessage.classList.remove('show');
                    contactForm.reset();
                    if (charCount) charCount.textContent = '0';
                    
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                    }, 5000);
                    
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }, (error) => {
                    console.error('EmailJS error:', error);
                    errorMessage.classList.add('show');
                    successMessage.classList.remove('show');
                    
                    setTimeout(() => {
                        errorMessage.classList.remove('show');
                    }, 5000);
                    
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                });
        }
    });

    // Remove error on input
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.closest('.form-group').classList.remove('error');
        });
    });
}

// =============== BACK TO TOP BUTTON ===============
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// =============== PERFORMANCE OPTIMIZATIONS ===============

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
const debouncedScrollHandler = debounce(() => {
    activeLinkOnScroll();
}, 50);

window.addEventListener('scroll', debouncedScrollHandler);

// =============== ACCESSIBILITY ENHANCEMENTS ===============

// Keyboard navigation for mobile menu
if (navToggle) {
    navToggle.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navToggle.click();
        }
    });
}

// Focus management for mobile menu
if (navMenu) {
    navMenu.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('uil-times');
            icon.classList.add('uil-bars');
            navToggle.focus();
        }
    });
}

// =============== LAZY LOADING FOR IMAGES ===============
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// =============== ERROR HANDLING ===============
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// =============== CONSOLE MESSAGE ===============
console.log('%c👋 Hello, Developer!', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%cInterested in the code? Check out the GitHub repo!', 'color: #a8a8b3; font-size: 14px;');
console.log('%c🚀 Built with passion by Wanade Botman', 'color: #00d4ff; font-size: 14px;');

// =============== EASTER EGG - KONAMI CODE ===============
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Create confetti effect
    const colors = ['#00d4ff', '#ff6b6b', '#ffd93d', '#6bff6b'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '99999';
            document.body.appendChild(confetti);
            
            let pos = -10;
            const fall = setInterval(() => {
                if (pos > window.innerHeight) {
                    clearInterval(fall);
                    confetti.remove();
                } else {
                    pos += 5;
                    confetti.style.top = pos + 'px';
                    confetti.style.transform = `rotate(${pos}deg)`;
                }
            }, 20);
        }, i * 30);
    }
    
    console.log('%c🎉 KONAMI CODE ACTIVATED! 🎉', 'color: #ffd93d; font-size: 24px; font-weight: bold;');
    console.log('%cYou found the secret! You\'re a true developer 🚀', 'color: #00d4ff; font-size: 16px;');
}

// =============== SECTION TRANSITIONS ===============
const sectionObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, sectionObserverOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    sectionObserver.observe(section);
});