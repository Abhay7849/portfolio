/**
 * ==========================================================================
 * PORTFOLIO JAVASCRIPT
 * Simple, vanilla JS for mobile menu, smooth scrolling & contact mailto
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DYNAMIC YEAR IN FOOTER
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. MOBILE NAVIGATION HAMBURGER MENU
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when any nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          navToggle.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // 3. NAVBAR SHADOW ON SCROLL
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.7)';
      navbar.style.borderBottomColor = 'rgba(59, 130, 246, 0.3)';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.borderBottomColor = 'var(--border-color)';
    }
  });

  // 4. ACTIVE NAVIGATION LINK HIGHLIGHT ON SCROLL
  const sections = document.querySelectorAll('section[id]');
  const handleScrollActive = () => {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (matchingLink) {
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', handleScrollActive);
});

/**
 * 5. CONTACT FORM HANDLER (Directly creates mailto: link without backend)
 * Reads user inputs and launches visitor's native email client
 */
function handleContactSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const serviceInput = document.getElementById('service-needed');
  const messageInput = document.getElementById('message');

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const service = serviceInput ? serviceInput.value : 'General Inquiry';
  const message = messageInput ? messageInput.value.trim() : '';

  if (!name || !email || !message) {
    alert('Please fill in all required fields.');
    return;
  }

  // Pre-formatted recipient, subject and body
  const recipient = 'abhay982997@gmail.com';
  const subject = encodeURIComponent(`New Inquiry: ${service} - from ${name}`);
  const body = encodeURIComponent(
    `Hello Abhay,\n\n` +
    `I would like to inquire about your freelance services.\n\n` +
    `Client Name: ${name}\n` +
    `Client Email: ${email}\n` +
    `Service Requested: ${service}\n\n` +
    `Project Details:\n${message}\n\n` +
    `Looking forward to hearing from you!`
  );

  // Trigger mailto link
  const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;
  window.location.href = mailtoUrl;
}
