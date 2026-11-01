// ApexGrowth Agency Interactive Scripts

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // 2. Billing Toggle (Monthly / Annual)
  const pricingToggle = document.getElementById('pricing-toggle');
  const amounts = document.querySelectorAll('.price-val .amount');
  const monthlyLbl = document.getElementById('monthly-lbl');
  const annualLbl = document.getElementById('annual-lbl');

  if (pricingToggle) {
    pricingToggle.addEventListener('change', () => {
      const isAnnual = pricingToggle.checked;

      if (isAnnual) {
        monthlyLbl.classList.remove('active');
        annualLbl.classList.add('active');
        amounts.forEach(el => {
          el.textContent = el.getAttribute('data-annual');
        });
      } else {
        annualLbl.classList.remove('active');
        monthlyLbl.classList.add('active');
        amounts.forEach(el => {
          el.textContent = el.getAttribute('data-monthly');
        });
      }
    });
  }

  // 3. FAQ Accordion Toggle
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('active');

      // Close other items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      // If clicked item wasn't open, open it
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
});

// 4. Lead Form Handler
function handleLeadSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('lead-name').value;
  const service = document.getElementById('lead-service').value;
  const msgEl = document.getElementById('lead-msg');

  msgEl.textContent = `Thanks ${name}! Your consultation request for ${service} has been received. We will contact you within 4 hours.`;
  document.getElementById('lead-form').reset();
}
