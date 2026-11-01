// Savoria Bistro & Cafe Interactive JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const toggleBtn = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');

  if (toggleBtn && nav) {
    toggleBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
      });
    });
  }

  // 2. Menu Filtering
  const filterBtns = document.querySelectorAll('.tab-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      menuCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});

// 3. Table Reservation Submission Handler
function handleReservation(e) {
  e.preventDefault();
  const name = document.getElementById('res-name').value;
  const time = document.getElementById('res-time').value;
  const date = document.getElementById('res-date').value;
  const guests = document.getElementById('res-guests').value;
  const msgEl = document.getElementById('res-msg');

  msgEl.textContent = `Thank you, ${name}! Your table for ${guests} on ${date} at ${time} has been requested. We will send a confirmation SMS shortly.`;
  document.getElementById('res-form').reset();
}
