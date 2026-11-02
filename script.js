/**
 * ==========================================================================
 * PORTFOLIO JAVASCRIPT — AWWWARDS-CALIBER INTERACTIONS & THREE.JS 3D HERO
 * Engineered for Abhay Singh | Full Stack Web Developer
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC FOOTER YEAR
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // 2. MOBILE MENU TOGGLE
  initMobileNav();

  // 3. CUSTOM INTERACTIVE CURSOR (Desktop only)
  initCustomCursor();

  // 4. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  initScrollReveal();

  // 5. NAVBAR SCROLL EFFECT & ACTIVE LINK HIGHLIGHT
  initNavbarScroll();

  // 6. THREE.JS 3D INTERACTIVE HERO VISUAL
  initHeroThreeJS();
});

/* ==========================================================================
   2. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggleBtn.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   3. CUSTOM INTERACTIVE CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return;

  // Check if device supports hover
  if (window.matchMedia('(hover: none)').matches) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Smooth lerp loop for the trailing ring
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  // Hover expansion on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .project-showcase, .skill-card, .service-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
  });
}

/* ==========================================================================
   4. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/* ==========================================================================
   5. NAVBAR SCROLL EFFECT & ACTIVE NAVIGATION
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Elevation shadow
    if (window.scrollY > 40) {
      navbar.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.8)';
      navbar.style.borderColor = 'rgba(56, 189, 248, 0.25)';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.borderColor = 'var(--border-color)';
    }

    // Active Section Indicator
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================================================
   6. THREE.JS 3D INTERACTIVE HERO VISUALIZATION
   ========================================================================== */
function initHeroThreeJS() {
  const container = document.getElementById('hero-3d-canvas');
  if (!container || typeof THREE === 'undefined') {
    renderFallbackGraphic(container);
    return;
  }

  try {
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.5;

    // 2. Renderer with Transparency
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Outer Polyhedron (Cyan Wireframe)
    const outerGeo = new THREE.IcosahedronGeometry(2.35, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    // 4. Inner Core Polyhedron (Electric Purple Wireframe)
    const innerGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // 5. Orbiting Ambient Particle Field
    const particleCount = 220;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 3.2 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.045,
      transparent: true,
      opacity: 0.65
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Mouse Interaction Variables
    let targetRotationX = 0;
    let targetRotationY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
      targetRotationY = (e.clientX - windowHalfX) * 0.0006;
      targetRotationX = (e.clientY - windowHalfY) * 0.0006;
    });

    // Handle touch movement on mobile
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        targetRotationY = (e.touches[0].clientX - windowHalfX) * 0.0006;
        targetRotationX = (e.touches[0].clientY - windowHalfY) * 0.0006;
      }
    }, { passive: true });

    // 7. Render Loop
    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Constant ambient rotation
      outerMesh.rotation.y += 0.0035;
      outerMesh.rotation.x += 0.002;
      innerMesh.rotation.y -= 0.005;
      innerMesh.rotation.z += 0.0025;
      particles.rotation.y -= 0.001;

      // Smooth mouse-following tilt
      outerMesh.rotation.y += (targetRotationY - outerMesh.rotation.y) * 0.04;
      outerMesh.rotation.x += (targetRotationX - outerMesh.rotation.x) * 0.04;

      // Subtle breathing scale pulse
      const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.025;
      outerMesh.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    }
    animate();

    // 8. Handle Window Resize
    window.addEventListener('resize', () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });

  } catch (err) {
    console.warn('WebGL / Three.js fallback active:', err);
    renderFallbackGraphic(container);
  }
}

// Graceful fallback for non-WebGL devices
function renderFallbackGraphic(container) {
  if (!container) return;
  container.innerHTML = `
    <div style="width: 280px; height: 280px; border-radius: 50%; background: radial-gradient(circle at 30% 30%, #38bdf8 0%, #8b5cf6 50%, #06080e 90%); box-shadow: 0 0 60px rgba(56, 189, 248, 0.35); margin: 0 auto; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(56, 189, 248, 0.4);">
      <span style="font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:800; color:#ffffff; text-shadow:0 2px 10px rgba(0,0,0,0.8);">MERN • Full Stack</span>
    </div>
  `;
}

/* ==========================================================================
   7. CONTACT FORM VALIDATION & DIRECT EMAIL TRIGGER
   ========================================================================== */
function handleContactSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const serviceInput = document.getElementById('service-needed');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');
  const statusEl = document.getElementById('form-status');

  // Reset errors
  nameError.textContent = '';
  emailError.textContent = '';
  messageError.textContent = '';
  nameInput.classList.remove('error');
  emailInput.classList.remove('error');
  messageInput.classList.remove('error');
  statusEl.textContent = '';

  let isValid = true;

  // 1. Validate Name
  const nameVal = nameInput.value.trim();
  if (nameVal.length < 2) {
    nameError.textContent = 'Please enter your full name (minimum 2 characters).';
    nameInput.classList.add('error');
    isValid = false;
  }

  // 2. Validate Email
  const emailVal = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailVal)) {
    emailError.textContent = 'Please enter a valid email address.';
    emailInput.classList.add('error');
    isValid = false;
  }

  // 3. Validate Message
  const messageVal = messageInput.value.trim();
  if (messageVal.length < 10) {
    messageError.textContent = 'Please describe your project (minimum 10 characters).';
    messageInput.classList.add('error');
    isValid = false;
  }

  if (!isValid) {
    statusEl.textContent = 'Please correct the highlighted fields above.';
    statusEl.className = 'form-status error';
    return;
  }

  // Pre-format and trigger client mailto
  const serviceVal = serviceInput ? serviceInput.value : 'Full Stack Web Project';
  const recipient = 'abhay982997@gmail.com';
  const subject = encodeURIComponent(`[Project Inquiry] ${serviceVal} - from ${nameVal}`);
  const body = encodeURIComponent(
    `Hello Abhay,\n\n` +
    `I would like to inquire about your Full Stack development services.\n\n` +
    `Client Name: ${nameVal}\n` +
    `Client Email: ${emailVal}\n` +
    `Service Selected: ${serviceVal}\n\n` +
    `Project Scope & Requirements:\n${messageVal}\n\n` +
    `Looking forward to discussing this project with you!`
  );

  const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

  statusEl.textContent = '✓ Validated! Opening your email client to send the project message...';
  statusEl.className = 'form-status success';

  setTimeout(() => {
    window.location.href = mailtoUrl;
  }, 400);
}
